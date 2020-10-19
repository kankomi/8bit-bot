import { Client, Message } from 'discord.js'
import EventHandlerInterface from './EventHandlerInterface'
import logger from '../utils/logging'

export default class DebugHandler extends EventHandlerInterface {
  constructor(client: Client) {
    super(client, 'debug')
  }

  async onMessage(message: Message) {
    if (process.env.NODE_ENV !== 'development' || message.author.id === this.client.user?.id) {
      return
    }

    logger.info(message.content)
  }
}
