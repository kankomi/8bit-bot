import { Collection, Message, TextChannel, VoiceConnection } from 'discord.js'
import { Maybe } from 'graphql/jsutils/Maybe'
import ytdl from 'ytdl-core'
import { prefix } from '../../config.json'
import { PlayerControlAction, Song } from '../../generated/graphql'
import * as player from '../../services/player'
import { searchSong } from '../../services/player'
import { Command } from '../../types'
import logger from '../../utils/logging'

const subscriptions = new Collection<string, any>()

/**
 * Creates the youtube audio stream.
 * @param connection
 * @param textChannel
 * @param song
 */
async function playStream(connection: VoiceConnection, textChannel: TextChannel, song: Song) {
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

/**
 * Subscribes to the graphql subscription.
 * @param guildId
 * @param connection
 * @param channel
 */
async function subscribeToPlayerControl(
  guildId: string,
  connection: Maybe<VoiceConnection>,
  channel: TextChannel
) {
  const subscription = player.subscribeToPlayerControlState(guildId).subscribe(async ({ data }) => {
    const action = data?.playerStateUpdated?.action
    const playSong = data?.playerStateUpdated?.song

    if (!action || !connection) {
      return
    }

    if (action === PlayerControlAction.Play && !playSong) {
      return
    }

    switch (action) {
      case PlayerControlAction.Pause:
        connection.dispatcher?.pause()
        break
      case PlayerControlAction.Resume:
        connection.dispatcher?.resume()
        break
      case PlayerControlAction.Stop:
        connection.dispatcher?.end()
        break
      case PlayerControlAction.Play: {
        const dispatcher = await playStream(connection, channel, playSong as Song)
        connection.on('closing', () => {
          player.stopPlayer(guildId)
          subscription.unsubscribe()
          subscriptions.delete(guildId)
          logger.info(`unsubscribing from player control for guild id ${guildId}`)
        })

        // gets called when the song is finished
        dispatcher.on('finish', async () => {
          const state = await player.getPlayerState(guildId)
          if (state?.songQueue && state.songQueue.length > 0) {
            player.nextSong(guildId)
          } else {
            dispatcher?.end()
          }
        })
        break
      }

      default:
        break
    }
  })

  return subscription
}

async function searchSongAndWaitForReply(
  searchTerm: string,
  channel: TextChannel
): Promise<Maybe<Song>> {
  // if the search term is just a number, assume that the user
  // just entered a result selection and so we don't need to search
  if (/^\d+$/g.test(searchTerm)) {
    return undefined
  }

  const results = await searchSong(searchTerm)

  if (!results) {
    channel.send(`Cannot find ${searchTerm}`)
    return undefined
  }

  let str = 'Choose result:\n```'
  for (let i = 0; i < results.length; i++) {
    const val = results[i]
    str += `\n${i + 1} - ${val.title}`
  }
  str += '```\n'

  channel.send(str)

  const replies = await channel.awaitMessages(
    (m: Message) => m.content.startsWith(`${prefix}play`),
    {
      max: 1,
      time: 10000,
    }
  )

  if (replies.array().length === 0) {
    return undefined
  }

  const reply = replies.first() as Message
  const number = parseInt(reply?.content.replace(`${prefix}play `, ''), 10)

  if (isNaN(number) || number < 1 || number > 5) {
    channel.send(`${number} is invalid`)
    return undefined
  }

  return results[number - 1]
}

const YtPlayCommand: Command = {
  name: 'play',
  usage: `${prefix}play [url]`,
  cooldown: 0,
  args: true,
  description: 'Plays a Youtube video',
  async execute(message: Message, args: string[]) {
    if (message.author.bot) {
      return false
    }

    if (message.channel.type === 'dm') {
      return false
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!')
      return false
    }

    if (args.length < 1) {
      logger.warn('No arguments given!')
      return false
    }

    const voiceChannel = message.member?.voice.channel
    const searchTerm = args.join('')
    const guildId = voiceChannel?.guild.id

    if (!guildId) {
      logger.error('Cannot get guildId')
      return false
    }

    if (!voiceChannel) {
      message.reply('please join a voice channel first')
      return false
    }

    // search the song on youtube and wait for the user to select one of the results
    const song = await searchSongAndWaitForReply(searchTerm, message.channel as TextChannel)

    if (!song) {
      return false
    }

    logger.info(`chosen song ${song?.title}`)

    // check if there is already an established voice connection
    // or if the current connection does not match the voice connection of the bot
    let connection = message.guild.voice?.connection
    if (!connection || message.guild.voice?.channel !== message.member?.voice.channel) {
      // join the voice channel of the message author
      connection = await voiceChannel.join()
    }

    // subscribe to player control changes, if not already
    if (!subscriptions.has(guildId)) {
      const sub = await subscribeToPlayerControl(
        guildId,
        connection,
        message.channel as TextChannel
      )

      subscriptions.set(guildId, sub)
    }

    // add the song to the queue
    // the backend will send the 'play' action when the song should be played
    const songQueue = await player.addSong(guildId, song.url)
    const position = songQueue.findIndex((s) => s.title === song.title)

    if (position !== -1) {
      let msg = `Adding \`${song.title}\` to queue at position ${position + 1}\n`
      msg += `Checkout the web player here: ${process.env.FRONTEND_URL}/player/${guildId}`
      message.channel.send(msg)
    }

    return true
  },
}

export default YtPlayCommand
