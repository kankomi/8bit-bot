import { Client, Message } from 'discord.js'
import logger from '../utils/logging'

export default abstract class EventHandlerInterface {
  client: Client
  name: string

  constructor(client: Client, name: string) {
    this.client = client
    this.name = name
    this.client.on('message', (message) => {
      this.onMessageWrapper(message)
    })
  }

  async onMessageWrapper(message: Message) {
    try {
      this.onMessage(message)
    } catch (error) {
      logger.error(`Error in onMessage occured: ${JSON.stringify(error, null, 2)}`)
    }
  }
  abstract async onMessage(message: Message): Promise<void>
}
