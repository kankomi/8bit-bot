import { Message } from 'discord.js'
import { prefix } from '../../config.json'
import { Command } from '../../types'
import logger from '../../utils/logging'
import * as experience from '../../services/experience'

const GetRankListCommand: Command = {
  name: 'ranking',
  usage: `${prefix}ranking`,
  aliases: ['ranks', 'rankings'],
  args: false,
  cooldown: 0,
  description: 'Shows top 10 rank list',
  async execute(message: Message) {
    if (message.author.bot) {
      return false
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!')
      return false
    }

    const guildId = message.guild.id
    const rankings = await experience.getRankings(guildId)

    if (!rankings) {
      message.channel.send('there are no rankings yet.')
      return false
    }

    let str = ''

    for (let i = 0; i < Math.min(rankings.length, 10); i++) {
      const rank = rankings[i]
      str += `${i + 1}: ${rank.user?.username} - Level ${rank.level} (${rank.experience} EXP) \n`
    }

    await message.channel.send(`\`\`\`${str}\`\`\``)

    return true
  },
}

export default GetRankListCommand
