import { Message } from 'discord.js'
import { prefix } from '../../config.json'
import { stopPlayer } from '../../services/player'
import { Command } from '../../types'
import logger from '../../utils/logging'

const YtStopCommand: Command = {
  name: 'stop',
  usage: `${prefix}stop`,
  cooldown: 0,
  args: false,
  description: 'Stops a Youtube video',
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
    const { voice } = message.guild

    if (!voice) {
      logger.info('Not connected to voice channel')
      return false
    }

    stopPlayer(message.guild.id)
    voice.connection?.dispatcher?.end()
    voice.channel?.leave()

    return true
  },
}

export default YtStopCommand
