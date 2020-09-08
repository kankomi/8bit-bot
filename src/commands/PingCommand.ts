import { Message } from 'discord.js';
import { Command } from '../types';
import { prefix } from '../config.json';

const PingCommand: Command = {
  name: 'ping',
  usage: `ping`,
  description: 'Bot will answer with pong',
  execute(message: Message, args: []) {
    message.channel.send('Pong!');
  },
};

export default PingCommand;
