import { Message } from 'discord.js'
import { prefix } from '../../config.json'
import { Command } from '../../types'
import logger from '../../utils/logging'
import * as player from '../../services/player'

const YtQueueCommand: Command = {
  name: 'queue',
  usage: `${prefix}queue`,
  aliases: ['q'],
  cooldown: 0,
  args: false,
  description: 'Shows the queue',
  async execute(message: Message) {
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

    const voiceChannel = message.member?.voice.channel

    if (!voiceChannel) {
      message.reply('please choin a voice channel first')
      return false
    }
    const playerState = await player.getPlayerState(message.guild.id)

    if (!playerState) {
      message.channel.send('Cannot get player state.')
      return true
    }

    const { songQueue } = playerState
    let str = '```'

    if (songQueue.length === 0) {
      message.channel.send('No songs queued.')
      return true
    }

    for (let i = 1; i <= songQueue.length; i++) {
      const { title } = songQueue[i - 1]
      str += `\n${playerState.isPlaying && i === 1 ? 'Now playing' : i - 1} - ${title}`
    }
    str += '\n```'
    str += `\nCheckout the web player here: ${process.env.FRONTEND_URL}/player/${message.guild.id}`

    message.channel.send(str)
    return true
  },
}

export default YtQueueCommand
