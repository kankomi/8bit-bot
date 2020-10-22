import {
  Collection,
  StreamDispatcher,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from 'discord.js'
import ytdl from 'ytdl-core'
import { PlayerState, Song } from '../generated/graphql'
import * as player from '../services/player'

export type ServerQueue = {
  playerState: PlayerState
  voiceChannel: VoiceChannel
  textChannel: TextChannel
  connection: VoiceConnection
  dispatcher?: StreamDispatcher
}

export default class StreamHandler {
  private static serverQueue = new Collection<string, ServerQueue>()

  static getServerQueue(guildId: string): ServerQueue | undefined {
    return this.serverQueue.get(guildId)
  }

  // static handleSubscription(guildId: string) {
  //   return (data: Maybe<SubscribeToPlayerStateSubscription>) => {
  //     const newState = data?.playerStateChanged
  //     const q = this.serverQueue.get(guildId)

  //     if (!newState || !q) {
  //       return
  //     }

  //     const oldState = { ...q.playerState }
  //     // set the new state
  //     logger.info('updating state')
  //     q.playerState = { ...newState }

  //     if (newState.songPlaying) {
  //       // the song url is different, we should play the new song
  //       if (newState.songPlaying?.url !== oldState.songPlaying?.url) {
  //         this.play(guildId, newState.songPlaying)
  //         logger.info(`playing song ${newState.songPlaying.title} now`)
  //         return
  //       }
  //     } else {
  //       // songPlaying === undefined means no song is playing
  //       this.stop(guildId)
  //       return
  //     }

  //     if (newState.isPlaying !== oldState.isPlaying) {
  //       if (newState.isPlaying) {
  //         this.resume(guildId)
  //       } else {
  //         this.pause(guildId)
  //       }
  //     }
  //   }
  // }

  static async createOrGetServerQueue(
    guildId: string,
    voiceChannel: VoiceChannel,
    textChannel: TextChannel,
    connection: VoiceConnection,
    dispatcher?: StreamDispatcher
  ): Promise<ServerQueue> {
    let queue = this.serverQueue.get(guildId)

    // check if there is already a state available
    let playerState = await player.getPlayerState(guildId)

    // if it does not exist, create a default state
    playerState = playerState || {
      songPlaying: undefined,
      isPlaying: false,
      songQueue: [],
    }

    if (queue) {
      queue.connection = connection
      queue.voiceChannel = voiceChannel
      queue.dispatcher = dispatcher
      queue.textChannel = textChannel
      return queue
    }

    // const state$ = player.subscribeToPlayerState(guildId)

    // const subscription = state$.subscribe(
    //   ({ data }) => this.handleSubscription(guildId)(data),
    //   (error) => logger.error(error)
    // )

    // connection.on('disconnect', () => {
    //   player.stopSong(guildId)
    //   subscription.unsubscribe()
    // })

    queue = {
      playerState,
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
      // q.playing = false
      // q.songs = []
      q.dispatcher?.end()
      q.voiceChannel.leave()
    }

    player.stopSong(guildId)
  }

  static async pause(guildId: string) {
    const q = this.serverQueue.get(guildId)
    if (q) {
      // q.playing = false
      // await q.textChannel.send(`Pausing song **${q.songs[0].title}**`)
      q.dispatcher?.pause()
    }

    player.togglePlayPause(guildId)
  }

  static async resume(guildId: string) {
    const q = this.serverQueue.get(guildId)
    if (q) {
      // q.playing = true
      // await q.textChannel.send(`Resuming song **${q.songs[0].title}**`)
      q.dispatcher?.resume()
    }
    player.togglePlayPause(guildId)
  }

  static async addSong(guildId: string, songUrl: string) {
    player.addSong(guildId, songUrl)
  }

  static skip(guildId: string) {
    player.nextSong(guildId)
  }

  static getSongQueue(guildId: string): Song[] {
    const songs = this.serverQueue.get(guildId)?.playerState.songQueue

    return songs !== undefined ? songs : []
  }

  static async play(connection: VoiceConnection, textChannel: TextChannel, song: Song) {
    const { url, title } = song

    const stream = ytdl(url, {
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
      filter: 'audioonly',
    })

    textChannel.send(
      `Playing song **${title}**\nCheckout the web player here: ${process.env.FRONTEND_URL}/player/${textChannel.guild.id}`
    )
    return connection.play(stream)
  }
}
