import { Message } from 'discord.js'
import config from '../../config'
import { Command } from '../../types'
import logger from '../../utils/logging'
import * as player from '../../services/player'

const { prefix } = config

const YtSkipCommand: Command = {
  name: 'skip',
  usage: `${prefix}skip`,
  cooldown: 0,
  args: false,
  description: 'Skips a Youtube video',
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

    if (!playerState || playerState?.songQueue.length === 0) {
      message.channel.send('No more songs in queue.')
      return true
    }

    player.nextSong(message.guild.id)

    return true
  },
}

export default YtSkipCommand
