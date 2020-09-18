import { Message } from 'discord.js';
import { prefix } from '../config.json';
import { Command } from '../types';
import logger from '../utils/logging';
import StreamHandler from '../youtube-stream/StreamHandler';

const YtStopCommand: Command = {
  name: 'queue',
  usage: `${prefix}queue`,
  aliases: ['q'],
  cooldown: 0,
  args: false,
  description: 'Shows the queue',
  async execute(message: Message) {
    if (message.author.bot) {
      return false;
    }

    if (message.channel.type === 'dm') {
      return false;
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!');
      return false;
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      message.reply('please choin a voice channel first');
      return false;
    }
    const queue = StreamHandler.getSongQueue(message.guild.id);
    let str = '```';

    if (queue.length === 0) {
      message.channel.send('No songs queued.');
      return true;
    }

    for (let i = 1; i <= queue.length; i++) {
      const { title } = queue[i - 1];
      str += `\n${i} - ${title}`;
    }
    str += '\n```';

    message.channel.send(str);
    return true;
  },
};

export default YtStopCommand;
