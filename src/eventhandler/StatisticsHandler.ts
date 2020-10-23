import { Client, Collection, Message, VoiceState } from 'discord.js'
import EventHandlerInterface from './EventHandlerInterface'
import logger from '../utils/logging'
import { updateStatistic } from '../services/statistics'
import { StatisticType } from '../generated/graphql'

export default class StatisticsHandler extends EventHandlerInterface {
  inVoiceChatTimestamps = new Collection<string, number>()

  constructor(client: Client) {
    super(client, 'statistics')

    client.on('voiceStateUpdate', (oldState, newState) => {
      this.onVoiceStateUpdate(oldState, newState)
    })
  }

  async onMessage(message: Message) {
    const guildId = message.guild?.id
    const userId = message.member?.id

    // don't collect statistics on bots
    if (message.member?.user.bot) {
      return
    }

    if (!guildId) {
      logger.error('cannot get guild id')
      return
    }

    if (!userId) {
      logger.error('cannot get user id')
      return
    }

    const newMessages = await updateStatistic(guildId, userId, StatisticType.Message, 1)
    if (newMessages) {
      logger.debug(`new message stats for user ${userId} is ${newMessages}`)
    }

    if (/http[s]?:\/\//g.test(message.content)) {
      const newLinks = await updateStatistic(guildId, userId, StatisticType.LinkPosted, 1)
      if (newLinks) {
        logger.debug(`New links stats for user ${userId} is ${newLinks}`)
      }
    }

    const filesPosted = message.attachments.array().length
    if (filesPosted > 0) {
      const newAtt = await updateStatistic(
        guildId,
        userId,
        StatisticType.AttachementPosted,
        filesPosted
      )
      if (newAtt) {
        logger.debug(`new attachment stats for user ${userId} are ${newAtt}`)
      }
    }
  }

  onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const userId = newState.member?.user.id
    const guildId = newState.guild.id
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
        // update stats for active time
        this.updateVoiceStats(userId, guildId)
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
      this.updateVoiceStats(userId, guildId)
    }
  }

  async updateVoiceStats(userId: string, guildId: string) {
    const enteredTimestamp = this.inVoiceChatTimestamps.get(userId)
    if (!enteredTimestamp) {
      logger.warn(`Cannot get enteredTimestamp for user ${userId}`)
      return
    }
    this.inVoiceChatTimestamps.delete(userId)

    const secondsInVc = Math.floor((Date.now() - enteredTimestamp) / 1000)

    try {
      const newTime = await updateStatistic(guildId, userId, StatisticType.TimeVcInS, secondsInVc)
      if (newTime) {
        logger.debug(`Update voice stats for user ${userId}, new voice time is ${newTime}`)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
