import { Message } from 'discord.js';
import { Command } from '../types';

const PingCommand: Command = {
  name: 'ping',
  usage: 'ping',
  description: 'Bot will answer with pong',
  execute(message: Message) {
    message.channel.send('Pong!');
  },
};

export default PingCommand;
