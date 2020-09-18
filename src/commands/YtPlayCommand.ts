import { Message } from 'discord.js';
import search from 'youtube-search';
import { prefix } from '../config.json';
import { Command } from '../types';
import logger from '../utils/logging';
import StreamHandler from '../youtube-stream/StreamHandler';

async function searchYt(
  term: string,
  opts: search.YouTubeSearchOptions
): Promise<search.YouTubeSearchResults[] | undefined> {
  return new Promise((resolve, reject) => {
    search(term, { key: process.env.YT_KEY, ...opts }, (err, results) => {
      if (err) reject(err);

      resolve(results);
    });
  });
}

async function findSong(searchTerm: string): Promise<string | undefined> {
  const results = await searchYt(searchTerm, { maxResults: 5, type: 'video' });

  if (results) {
    logger.info(JSON.stringify(results));
    return results[0].link;
  }

  return undefined;
}

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
      const songUrl = await findSong(url);
      if (!songUrl) {
        message.channel.send(`Cannot find ${url}`);
        return false;
      }

      await StreamHandler.addSong(message.guild.id, songUrl);
      if (!queue.playing) {
        StreamHandler.play(message.guild.id);
      } else {
        message.channel.send(`Queueing song at position ${queue.songs.length - 1}`);
      }
    } catch (ex) {
      logger.error(`Cannot play "${url}": ${ex}`);
      message.reply(`Cannot play "${url}"`);
      return false;
    }

    return true;
  },
};

export default YtPlayCommand;
