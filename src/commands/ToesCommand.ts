import { Message } from 'discord.js'
import { prefix } from '../config.json'
import { StatisticType } from '../generated/graphql'
import * as statistics from '../services/statistics'
import { Command } from '../types'
import logger from '../utils/logging'

const ToesCommand: Command = {
  name: 'toes',
  usage: `${prefix}toes [@user](optional)`,
  args: false,
  cooldown: 10,
  description: 'Shows how many times @user mentioned toes',

  async execute(message: Message, args: string[]) {
    let user = message.author
    const guildId = message.guild?.id

    if (!guildId) {
      logger.error('Cannot get guildId in ToesCommand')
      return false
    }

    if (args.length > 0) {
      const mentionedUser = message.mentions.users.first()

      if (!mentionedUser) {
        message.reply(`Cannot find user \`${args[0]}\``)
        return false
      }
      user = mentionedUser
    }

    const result = await statistics.getStatistic(guildId, user.id, StatisticType.Toe)

    if (!result) {
      await message.channel.send(`${user.username} didn't mention toes even once!`)
    } else {
      await message.channel.send(`${user.username} mentioned toes ${result} times!`)
    }

    return true
  },
}

export default ToesCommand
