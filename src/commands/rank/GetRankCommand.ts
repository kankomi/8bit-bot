import { Message } from 'discord.js'
import config from '../../config'
import * as expService from '../../services/experience'
import { Command } from '../../types'
import logger from '../../utils/logging'

const { prefix } = config

const GetRankCommand: Command = {
  name: 'rank',
  usage: `${prefix}rank [@user](optional)`,
  aliases: ['r'],
  cooldown: 0,
  args: false,
  description: 'Shows the rank of a user',
  async execute(message: Message, args: string[]) {
    if (message.author.bot) {
      return false
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!')
      return false
    }

    let userId = message.author.id
    let { username } = message.author
    const guildId = message.guild.id
    if (args.length > 0) {
      const user = message.mentions.members?.first()?.user
      if (!user) {
        message.channel.send(`Cannot find user ${args[0]}`)
        return false
      }
      userId = user.id
      username = user.username
    }
    const rank = await expService.getRanking(guildId, userId)

    if (!rank) {
      logger.error(`Could not create ranking for user ${userId} in guild ${guildId}`)
      return false
    }

    await message.channel.send(
      `\`${username} is level ${rank.level} with ${rank.experience} EXP. EXP needed for next level: ${rank.expToNextLevel}.\``
    )

    return true
  },
}

export default GetRankCommand
