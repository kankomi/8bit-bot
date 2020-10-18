import {
  Client,
  Collection,
  Message,
  MessageReaction,
  PartialUser,
  User,
  VoiceState,
} from 'discord.js'
import Ranking from '../db/models/Ranking'
import { getLevelForExp } from '../utils/experience'
import logger from '../utils/logging'
import TimeoutCache from '../utils/TimeoutCache'
import EventHandlerInterface from './EventHandlerInterface'
import { experience } from '../config.json'

export default class ExpHandler extends EventHandlerInterface {
  messageCooldowns = new TimeoutCache(5)
  reactionCooldowns = new TimeoutCache(10)
  inVoiceChatTimestamps = new Collection<string, number>()

  constructor(client: Client) {
    super(client)
    this.name = 'exp'

    this.client.on('message', (message) => {
      this.onMessage(message)
    })

    this.client.on('voiceStateUpdate', (oldState, newState) => {
      this.onVoiceStateUpdate(oldState, newState)
    })

    this.client.on('messageReactionAdd', (reaction, user) => {
      this.onMessageReactionAdd(reaction, user)
    })
  }

  async onMessage(message: Message) {
    const userId = message.author.id
    const guildId = message.guild?.id

    if (!guildId) {
      logger.warn('Cannot get guildId in onMessage')
      return
    }

    // ignore bots and bot commands
    if (message.author.bot === true || message.content.match(/^[\\.|,|;|!].*/)) {
      return
    }

    if (!this.messageCooldowns.isExpired(userId)) {
      logger.info(
        `${
          message.author.username
        } exp gain is on cooldown for ${this.messageCooldowns.timeToExpired(userId)} seconds.`
      )

      // reset cooldown timer
      this.messageCooldowns.set(userId, message.createdTimestamp)

      return
    }

    this.messageCooldowns.set(userId, message.createdTimestamp)

    await this.giveExp(userId, guildId, experience.MESSAGE_EXP)
    logger.info(
      `${message.author.username} gained ${experience.MESSAGE_EXP} exp for writing a message.`
    )
  }

  onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const userId = newState.member?.user.id
    const guildId = newState.guild.id
    const username = newState.member?.user.username
    const guildAfkChannel = newState.guild.afkChannel

    if (!userId) {
      logger.warn('Cannot get userId in onVoiceStateUpdate')
      return
    }

    if (newState.member?.user.bot) {
      return
    }

    if (guildAfkChannel !== null) {
      // back from AFK channel
      if (
        oldState.channel === guildAfkChannel &&
        newState.channel !== null &&
        newState.channel !== guildAfkChannel
      ) {
        this.inVoiceChatTimestamps.set(userId, Date.now())
        return
      }

      // moved to AFK channel
      if (oldState.channel && newState.channel === guildAfkChannel) {
        // reward for active time
        this.rewardUserForTimeInVc(userId, guildId, username)
        return
      }
    }

    if (oldState.channelID && newState.channelID) {
      // user just switched channels, nothing to do
      return
    }

    // user entered a channel
    if (!oldState.channelID && newState.channelID) {
      this.inVoiceChatTimestamps.set(userId, Date.now())
    }

    // user left a channel
    if (oldState.channelID && !newState.channelID) {
      this.rewardUserForTimeInVc(userId, guildId, username)
    }
  }

  async rewardUserForTimeInVc(userId: string, guildId: string, username?: string) {
    const enteredTimestamp = this.inVoiceChatTimestamps.get(userId)
    if (!enteredTimestamp) {
      logger.warn(`Cannot get enteredTimestamp for user ${userId}`)
      return
    }
    this.inVoiceChatTimestamps.delete(userId)

    const minutesinVc = (Date.now() - enteredTimestamp) / (1000 * 60)
    const exp = Math.round(minutesinVc * experience.VOICE_PER_M_EXP)

    if (exp > 0) {
      this.giveExp(userId, guildId, exp)

      logger.info(`${username} gained ${exp} exp for being in VC for ${minutesinVc} minutes.`)
    }
  }

  async onMessageReactionAdd(reaction: MessageReaction, user: User | PartialUser) {
    const message = await reaction.message.fetch()
    const userIdReceived = message.author.id
    const userIdGiven = user.id
    const guildId = message.guild?.id
    const { NODE_ENV } = process.env

    if (!guildId) {
      logger.warn('Cannot get guildId in onMessageReactionAdd')
      return
    }

    // ignore bots
    if (user.bot) {
      return
    }

    // ignore reaction given to your own message
    if (userIdGiven === userIdReceived && NODE_ENV !== 'development') {
      return
    }

    // always give the receiver exp
    await this.giveExp(userIdReceived, guildId, experience.RECEIVE_REACTION_EXP)
    logger.info(
      `Giving ${message.author.username} ${experience.RECEIVE_REACTION_EXP} exp for getting a reaction.`
    )

    // give reaction giver exp on cooldown
    if (this.reactionCooldowns.isExpired(userIdGiven)) {
      await this.giveExp(userIdGiven, guildId, experience.GIVE_REACTION_EXP)
      logger.info(
        `Giving ${user.username} ${experience.GIVE_REACTION_EXP} exp for giving a reaction.`
      )
      this.reactionCooldowns.set(userIdGiven)
    }
  }

  async giveExp(userId: string, guildId: string, exp: number) {
    const result = await Ranking.findOne({
      where: { userId, guildId },
    })

    if (!result) {
      await Ranking.create({ userId, guildId })
    } else {
      result.experience += exp
      result.level = getLevelForExp(result.experience)
      await result.save()
    }
  }
}
