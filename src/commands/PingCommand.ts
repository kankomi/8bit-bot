import { Message } from 'discord.js';
import Command from './Command';

export default class PingCommand extends Command {
  constructor() {
    super('name', { description: 'Ping!' });
  }
  execute(message: Message, args: string[]) {
    message.channel.send('Pong!');
  }
}
