import { Collection, VoiceChannel, VoiceConnection } from 'discord.js';
import ytdl from 'ytdl-core';
import { Song } from '../types';
import logger from '../utils/logging';

export type ServerQueue = {
  songs: Song[];
  voiceChannel: VoiceChannel;
  playing: boolean;
  connection: VoiceConnection;
};

export default class StreamHandler {
  private static serverQueue = new Collection<string, ServerQueue>();

  static getServerQueue(guildId: string): ServerQueue | undefined {
    return this.serverQueue.get(guildId);
  }

  static createOrGetServerQueue(
    guildId: string,
    voiceChannel: VoiceChannel,
    connection: VoiceConnection
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
    };
    this.serverQueue.set(guildId, queue);

    return queue;
  }

  static stop(guildId: string) {
    const q = this.serverQueue.get(guildId);
    if (q) {
      q.playing = false;
      q.songs = [];
      q.connection.dispatcher?.end();
    }
  }

  static async addSong(guildId: string, songUrl: string) {
    const q = this.serverQueue.get(guildId);
    if (q) {
      const { videoDetails } = await ytdl.getInfo(songUrl);
      q.songs.push({ url: songUrl, title: videoDetails.title });
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

    const dispatch = queue.connection.play(stream);
    queue.playing = true;

    logger.info(`Playing ${queue.songs[0].title} in guild ${guildId}`);

    dispatch
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
