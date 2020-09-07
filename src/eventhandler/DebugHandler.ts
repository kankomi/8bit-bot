import EventHandlerInterface from './EventHandlerInterface';
import { Client, TextChannel } from 'discord.js';

export default class DebugHandler extends EventHandlerInterface {
  constructor(client: Client) {
    super(client);
    this.name = 'debug';
    this.client.on('message', (message) => {
      if (
        process.env.NODE_ENV !== 'development' ||
        message.author.id === this.client.user?.id
      ) {
        return;
      }

      console.log(message.content);
    });
  }
}
