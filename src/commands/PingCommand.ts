import { Message } from 'discord.js';
import { Command } from '../types';

const PingCommand: Command = {
  name: 'ping',
  usage: 'ping',
  args: false,
  cooldown: 10,
  description: 'Bot will answer with pong',
  execute(message: Message) {
    message.channel.send('Pong!');
  },
};

export default PingCommand;
