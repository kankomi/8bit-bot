import { Message, Client } from 'discord.js'
import EventHandlerInterface from './EventHandlerInterface'
import ToeCounter from '../db/models/ToeCounter'
import { prefix } from '../config.json'

export default class ToeHandler extends EventHandlerInterface {
  messageTimestampCache: { [userId: string]: number } = {}
  constructor(client: Client) {
    super(client)
    this.name = 'toes'

    this.client.on('message', (msg) => this.execute(msg))
  }

  // eslint-disable-next-line class-methods-use-this
  async execute(message: Message) {
    if (
      message.content.startsWith(prefix) ||
      message.client.user?.id === message.author.id ||
      !message.content.toLowerCase().includes('toe')
    ) {
      return
    }
    const userId = message.author.id
    const lastTimestamp = this.messageTimestampCache[userId]
    if (lastTimestamp && Date.now() - lastTimestamp < 60 * 1000) {
      message.react('😡')
      message.channel.send(`No need to spam toes <@${userId}>! Enjoy your toes slowly 🦶`)
    } else {
      message.react('👌')
    }

    this.messageTimestampCache[userId] = message.createdTimestamp

    const result = await ToeCounter.findOne({ where: { userId } })

    if (!result) {
      await ToeCounter.create({ userId, count: 1 })
    } else {
      result.count += 1
      await result.save()
    }
  }
}
