import { Client, Message } from 'discord.js'

export default abstract class EventHandlerInterface {
  client: Client
  name: string

  constructor(client: Client, name: string) {
    this.client = client
    this.name = name
    this.client.on('message', (message) => this.onMessage(message))
  }

  abstract async onMessage(message: Message): Promise<void>
}
