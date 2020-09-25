import {
  Collection,
  StreamDispatcher,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js';
import ytdl from 'ytdl-core';
import { Song } from '../types';
import logger from '../utils/logging';

export type ServerQueue = {
  songs: Song[];
  voiceChannel: VoiceChannel;
  textChannel: TextChannel;
  playing: boolean;
  connection: VoiceConnection;
  dispatcher?: StreamDispatcher;
};

export default class StreamHandler {
  private static serverQueue = new Collection<string, ServerQueue>();

  static getServerQueue(guildId: string): ServerQueue | undefined {
    return this.serverQueue.get(guildId);
  }

  static createOrGetServerQueue(
    guildId: string,
    voiceChannel: VoiceChannel,
    textChannel: TextChannel,
    connection: VoiceConnection,
    dispatcher?: StreamDispatcher
  ): ServerQueue {
    let queue = this.serverQueue.get(guildId);

    if (queue) {
      return queue;
    }

    queue = {
      songs: [],
      playing: false,
      connection,
      voiceChannel,
      textChannel,
      dispatcher,
    };
    this.serverQueue.set(guildId, queue);

    return queue;
  }

  static stop(guildId: string) {
    const q = this.serverQueue.get(guildId);
    if (q) {
      q.playing = false;
      q.songs = [];
      q.dispatcher?.end();
      q.voiceChannel.leave();
    }
  }

  static async pause(guildId: string) {
    const q = this.serverQueue.get(guildId);
    if (q) {
      q.playing = false;
      await q.textChannel.send(`Pausing song **${q.songs[0].title}**`);
      q.dispatcher?.pause();
    }
  }

  static async resume(guildId: string) {
    const q = this.serverQueue.get(guildId);
    if (q) {
      q.playing = true;
      await q.textChannel.send(`Resuming song **${q.songs[0].title}**`);
      q.dispatcher?.resume();
    }
  }

  static async addSong(guildId: string, songUrl: string) {
    const q = this.serverQueue.get(guildId);
    if (q) {
      const { videoDetails } = await ytdl.getInfo(songUrl);

      q.songs.push({
        url: songUrl,
        title: videoDetails.title,
        cover: videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length - 1].url,
      });
    }
  }

  static skip(guildId: string) {
    const q = this.serverQueue.get(guildId);

    if (!q) {
      return;
    }

    q.connection.dispatcher.end();
  }

  static getSongQueue(guildId: string): Song[] {
    const songs = this.serverQueue.get(guildId)?.songs;

    return songs !== undefined ? songs : [];
  }

  static async play(guildId: string) {
    const queue = this.serverQueue.get(guildId);

    if (!queue) {
      logger.warn(`guildId ${guildId} not in server queue`);
      return;
    }

    if (queue.songs.length === 0) {
      queue.connection.dispatcher?.end();
      queue.playing = false;
      return;
    }

    const stream = ytdl(queue.songs[0].url, {
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
      filter: 'audioonly',
    });

    queue.textChannel.send(`Playing song **${queue.songs[0].title}**`);
    const dispatcher = queue.connection.play(stream);
    queue.playing = true;
    queue.dispatcher = dispatcher;

    logger.info(`Playing ${queue.songs[0].title} in guild ${guildId}`);

    dispatcher
      .on('finish', () => {
        queue.songs.shift();
        if (queue.songs.length > 0) {
          this.play(guildId);
        } else {
          queue.playing = false;
        }
      })
      .on('error', (err) => logger.error(err));
  }
}
