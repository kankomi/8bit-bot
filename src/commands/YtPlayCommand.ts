import { Message } from 'discord.js';
import { prefix } from '../config.json';
import { Command } from '../types';
import logger from '../utils/logging';
import StreamHandler from '../youtube-stream/StreamHandler';

const YtPlayCommand: Command = {
  name: 'play',
  usage: `${prefix}play [url]`,
  cooldown: 0,
  args: true,
  description: 'Plays a Youtube video',
  async execute(message: Message, args: string[]) {
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

    if (args.length < 1) {
      logger.warn('No arguments given!');
      return false;
    }

    const voiceChannel = message.member?.voice.channel;
    const url = args[0];

    if (!voiceChannel) {
      message.reply('please choin a voice channel first');
      return false;
    }

    const connection = await voiceChannel.join();

    try {
      const queue = StreamHandler.createOrGetServerQueue(
        message.guild.id,
        voiceChannel,
        connection
      );

      queue.connection = connection;

      await StreamHandler.addSong(message.guild.id, url);
      if (!queue.playing) {
        StreamHandler.play(message.guild.id);
      } else {
        message.channel.send(`Queueing song at position ${queue.songs.length - 1}`);
      }
    } catch (ex) {
      logger.error(`Cannot play "${url}": ${ex}`);
      message.reply(`Cannot play "${url}`);
      return false;
    }

    return true;
  },
};

export default YtPlayCommand;
