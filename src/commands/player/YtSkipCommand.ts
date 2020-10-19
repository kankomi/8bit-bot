import { Message } from 'discord.js'
import { prefix } from '../../config.json'
import { Command } from '../../types'
import logger from '../../utils/logging'
import StreamHandler from '../../youtube-stream/StreamHandler'

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
    StreamHandler.skip(message.guild.id)

    return true
  },
}

export default YtSkipCommand
