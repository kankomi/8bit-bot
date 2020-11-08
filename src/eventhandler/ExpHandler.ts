import {
  Client,
  Collection,
  Message,
  MessageAttachment,
  MessageReaction,
  PartialUser,
  TextChannel,
  User,
  VoiceState,
} from 'discord.js'
import { ExperienceType } from '../generated/graphql'
import { getRanking, giveExperience } from '../services/experience'
import logger from '../utils/logging'
import TimeoutCache from '../utils/TimeoutCache'
import EventHandlerInterface from './EventHandlerInterface'
import createBanner from '../services/banner/createBanner'

export default class ExpHandler extends EventHandlerInterface {
  messageCooldowns = new TimeoutCache(5)
  reactionCooldowns = new TimeoutCache(10)
  inVoiceChatTimestamps = new Collection<string, number>()

  constructor(client: Client) {
    super(client, 'exp')

    this.client.on('voiceStateUpdate', (oldState, newState) => {
      try {
        this.onVoiceStateUpdate(oldState, newState)
      } catch (error) {
        logger.error(`error in onVoiceChangeUpdate occured: ${JSON.stringify(error, null, 2)}`)
      }
    })

    this.client.on('messageReactionAdd', (reaction, user) => {
      this.onMessageReactionAdd(reaction, user)
    })
  }

  async hasLeveledUp(guildId: string, userId: string) {
    const guild = this.client.guilds.cache.get(guildId)
    if (!guild) {
      throw new Error('cannot get guild')
    }

    const channel = guild.channels.cache.find(
      (c) => c.name === process.env.BOT_CHANNEL!
    ) as TextChannel

    if (!channel) {
      throw new Error('cannot find channel')
    }
    const user = guild.member(userId)
    if (!user) {
      throw new Error('cannot find user')
    }

    const rank = await getRanking(guildId, userId)

    if (!rank) {
      throw new Error('cannot get ranking')
    }

    const banner = await createBanner(
      user.user.username,
      rank.level,
      rank.experience,
      rank.expToNextLevel + rank.experience,
      user.user.avatarURL() || user.user.defaultAvatarURL
    )

    if (banner) {
      await channel.send(
        `<@${userId}> has leveled up!`,
        new MessageAttachment(banner!, 'banner.jpg')
      )
    } else {
      await channel.send(
        `\`${user.user.username} is level ${rank.level} with ${rank.experience} EXP. EXP needed for next level: ${rank.expToNextLevel}.\``
      )
    }
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

    const expGained = await giveExperience(guildId, userId, ExperienceType.Message)
    if (expGained && expGained.hasLeveledUp) {
      this.hasLeveledUp(guildId, userId)
      logger.info(
        `${message.author.username} gained ${expGained?.expGained} exp for writing a message.`
      )
    }
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

    const secondsInVc = (Date.now() - enteredTimestamp) / 1000
    const expGained = await giveExperience(guildId, userId, ExperienceType.Voice, secondsInVc)

    if (expGained && expGained.hasLeveledUp) {
      this.hasLeveledUp(guildId, userId)
    }

    logger.info(
      `${username} gained ${expGained?.expGained} exp for being in VC for ${
        secondsInVc / 60
      } minutes.`
    )
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
    const expGained = await giveExperience(guildId, userIdReceived, ExperienceType.ReceiveReaction)
    logger.info(
      `Giving ${message.author.username} ${expGained?.expGained} exp for getting a reaction.`
    )

    if (expGained && expGained.hasLeveledUp) {
      this.hasLeveledUp(guildId, userIdReceived)
    }

    // give reaction giver exp on cooldown
    if (this.reactionCooldowns.isExpired(userIdGiven)) {
      const exp = await giveExperience(guildId, userIdGiven, ExperienceType.GiveReaction)

      if (exp && exp.hasLeveledUp) {
        this.hasLeveledUp(guildId, userIdGiven)
      }

      logger.info(`Giving ${user.username} ${exp?.expGained} exp for giving a reaction.`)
      this.reactionCooldowns.set(userIdGiven)
    }
  }
}
