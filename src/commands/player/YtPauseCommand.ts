import { Message } from 'discord.js'
import { prefix } from '../../config.json'
import * as player from '../../services/player'
import { Command } from '../../types'
import logger from '../../utils/logging'

const YtPauseCommand: Command = {
  name: 'pause',
  usage: `${prefix}pause`,
  cooldown: 0,
  args: false,
  description: 'Pauses a Youtube video',
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

    player.togglePlayPause(message.guild.id)

    return true
  },
}

export default YtPauseCommand
