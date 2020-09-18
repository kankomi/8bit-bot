import { Collection, Message } from 'discord.js';
import search from 'youtube-search';
import { prefix } from '../config.json';
import { Command } from '../types';
import logger from '../utils/logging';
import StreamHandler from '../youtube-stream/StreamHandler';

// TODO: move to own file
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

const SearchCache = new Collection<string, search.YouTubeSearchResults[]>();

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
    const searchTerm = args.join('');

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
      const cacheHit = SearchCache.get(message.guild.id);
      const num = parseInt(searchTerm, 10);

      // check for results in cache
      if (cacheHit && !isNaN(num)) {
        if (num < 1 || num > 5) {
          message.channel.send('Choose a valid number between 1 and 5');
          return false;
        }

        await StreamHandler.addSong(message.guild.id, cacheHit[num - 1].link);
        SearchCache.delete(message.guild.id);
        if (!queue.playing) {
          StreamHandler.play(message.guild.id);
        } else {
          message.channel.send(`Queueing song at position ${queue.songs.length - 1}`);
        }
        // ... or search via yt api
      } else {
        const results = await searchYt(searchTerm, { maxResults: 5, type: 'video' });
        if (!results) {
          message.channel.send(`Cannot find ${searchTerm}`);
          return false;
        }
        SearchCache.set(message.guild.id, results);

        let str = 'Choose result:\n```';
        for (let i = 0; i < results.length; i++) {
          const val = results[i];
          str += `\n${i + 1} - ${val.title}`;
        }
        str += '```\n';

        message.channel.send(str);
      }
    } catch (ex) {
      logger.error(`Cannot play "${searchTerm}": ${ex}`);
      message.reply(`Cannot play "${searchTerm}"`);
      return false;
    }

    return true;
  },
};

export default YtPlayCommand;
