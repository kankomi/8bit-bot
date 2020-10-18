import {
  Collection,
  StreamDispatcher,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js'
import ytdl from 'ytdl-core'
import apolloClient from '../apollo-client'
import { PlayerState, Song } from '../types'
import logger from '../utils/logging'
import {
  ADD_SONG_MUTATION,
  NEXT_SONG_MUTATION,
  STOP_MUTATION,
  SUBSCRIBE_PLAYER_STATE,
} from './player-queries'

export type ServerQueue = {
  songs: Song[]
  voiceChannel: VoiceChannel
  textChannel: TextChannel
  playing: boolean
  connection: VoiceConnection
  dispatcher?: StreamDispatcher
}

export default class StreamHandler {
  private static serverQueue = new Collection<string, ServerQueue>()

  static getServerQueue(guildId: string): ServerQueue | undefined {
    return this.serverQueue.get(guildId)
  }

  static handleSubscription(guildId: string) {
    return (data: { playerStateChanged: PlayerState } | null | undefined) => {
      const state = data?.playerStateChanged
      const q = this.serverQueue.get(guildId)

      if (!state || !q) {
        return
      }

      if (state.songPlaying !== undefined) {
        if (state.songPlaying.url !== q.songs[0]?.url) {
          this.play(guildId, state.songPlaying)
          logger.info(`playing song ${state.songPlaying.title} now`)
        }

        q.songs = [state.songPlaying, ...state.songQueue]
      }

      if (state.isPlaying !== q.playing) {
        if (state.isPlaying) {
          this.resume(guildId)
        } else {
          this.pause(guildId)
        }
      }
    }
  }

  static createOrGetServerQueue(
    guildId: string,
    voiceChannel: VoiceChannel,
    textChannel: TextChannel,
    connection: VoiceConnection,
    dispatcher?: StreamDispatcher
  ): ServerQueue {
    let queue = this.serverQueue.get(guildId)

    if (queue) {
      return queue
    }

    const state$ = apolloClient.subscribe<{ playerStateChanged: PlayerState }>({
      query: SUBSCRIBE_PLAYER_STATE,
      variables: { guildId },
    })

    const subscription = state$.subscribe(
      ({ data }) => this.handleSubscription(guildId)(data),
      (error) => logger.error(error)
    )

    connection.on('disconnect', () => {
      apolloClient.mutate({ mutation: STOP_MUTATION, variables: { guildId } })
      subscription.unsubscribe()
    })

    queue = {
      songs: [],
      playing: false,
      connection,
      voiceChannel,
      textChannel,
      dispatcher,
    }
    this.serverQueue.set(guildId, queue)

    return queue
  }

  static stop(guildId: string) {
    const q = this.serverQueue.get(guildId)
    if (q) {
      q.playing = false
      q.songs = []
      q.dispatcher?.end()
      q.voiceChannel.leave()
    }
  }

  static async pause(guildId: string) {
    const q = this.serverQueue.get(guildId)
    if (q) {
      q.playing = false
      // await q.textChannel.send(`Pausing song **${q.songs[0].title}**`)
      q.dispatcher?.pause()
    }
  }

  static async resume(guildId: string) {
    const q = this.serverQueue.get(guildId)
    if (q) {
      q.playing = true
      // await q.textChannel.send(`Resuming song **${q.songs[0].title}**`)
      q.dispatcher?.resume()
    }
  }

  static async addSong(guildId: string, songUrl: string) {
    const q = this.serverQueue.get(guildId)
    if (q) {
      const { videoDetails } = await ytdl.getInfo(songUrl)

      q.songs.push({
        url: songUrl,
        title: videoDetails.title,
        cover: videoDetails.thumbnail.thumbnails[videoDetails.thumbnail.thumbnails.length - 1].url,
      })

      apolloClient.mutate({ mutation: ADD_SONG_MUTATION, variables: { guildId, url: songUrl } })
    }
  }

  static skip(guildId: string) {
    const q = this.serverQueue.get(guildId)

    if (!q) {
      return
    }

    q.connection.dispatcher.end()
  }

  static getSongQueue(guildId: string): Song[] {
    const songs = this.serverQueue.get(guildId)?.songs

    return songs !== undefined ? songs : []
  }

  static async play(guildId: string, song?: Song) {
    const queue = this.serverQueue.get(guildId)

    if (!queue) {
      logger.warn(`guildId ${guildId} not in server queue`)
      return
    }
    if (queue.songs.length === 0 && song === undefined) {
      queue.connection.dispatcher?.end()
      queue.playing = false
      return
    }

    const url = song?.url || queue.songs[0].url
    const title = song?.title || queue.songs[0].title

    const stream = ytdl(url, {
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
      filter: 'audioonly',
    })

    queue.textChannel.send(`Playing song **${title}**`)
    const dispatcher = queue.connection.play(stream)
    queue.playing = true
    queue.dispatcher = dispatcher

    logger.info(`Playing ${title} in guild ${guildId}`)

    dispatcher
      .on('finish', () => {
        if (queue.songs.length > 0) {
          apolloClient.mutate({ mutation: NEXT_SONG_MUTATION, variables: { guildId } })
        } else {
          apolloClient.mutate({ mutation: STOP_MUTATION, variables: { guildId } })
          queue.playing = false
        }
      })
      .on('error', (err) => logger.error(err))
  }
}
