import { Message, Client } from 'discord.js'
import EventHandlerInterface from './EventHandlerInterface'
import { prefix } from '../config.json'
import * as statistics from '../services/statistics'
import logger from '../utils/logging'
import { StatisticType } from '../generated/graphql'

export default class ToeHandler extends EventHandlerInterface {
  messageTimestampCache: { [userId: string]: number } = {}
  constructor(client: Client) {
    super(client, 'toes')
  }

  // eslint-disable-next-line class-methods-use-this
  async onMessage(message: Message) {
    if (
      message.content.startsWith(prefix) ||
      message.client.user?.id === message.author.id ||
      !message.content.toLowerCase().includes('toe')
    ) {
      return
    }
    const userId = message.author.id
    const guildId = message.guild?.id

    if (!guildId) {
      logger.error('Cannot get guild id in toes handler')
      return
    }

    const lastTimestamp = this.messageTimestampCache[userId]
    if (lastTimestamp && Date.now() - lastTimestamp < 60 * 1000) {
      message.react('😡')
      message.channel.send(`No need to spam toes <@${userId}>! Enjoy your toes slowly 🦶`)
    } else {
      message.react('👌')
    }

    this.messageTimestampCache[userId] = message.createdTimestamp

    statistics.updateStatistic(guildId, userId, StatisticType.Toe, 1)
  }
}
