import { Message } from 'discord.js'
import { prefix } from '../../config.json'
import Ranking from '../../db/models/Ranking'
import { Command } from '../../types'
import logger from '../../utils/logging'

const GiftExpCommand: Command = {
  name: 'gift',
  usage: `${prefix}gift [@user] [amount]`,
  cooldown: 0,
  args: true,
  description: 'Gifts [amount] exp to [@user]',
  async execute(message: Message, args: string[]) {
    if (message.author.bot) {
      return false
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!')
      return false
    }

    if (args.length < 2) {
      message.reply('need `[user] [amount]` as argument')
      return false
    }

    const amount = parseInt(args[1], 10)

    if (isNaN(amount) || amount < 0) {
      message.reply(`${args[1]} is an invalid amount, need a positive number`)
      return false
    }

    const receiverUserId = message.mentions.users.first()?.id
    const authorUserId = message.author.id
    const guildId = message.guild.id

    if (!receiverUserId) {
      message.channel.send(`Cannot find user ${args[0]}`)
      return false
    }

    const authorRank = await Ranking.getOrCreateRanking(authorUserId, guildId)
    const receiverRank = await Ranking.getOrCreateRanking(receiverUserId, guildId)

    if (!authorRank || !receiverRank) {
      return false
    }

    if (authorRank.experience < amount) {
      message.reply(`Cannot gift ${amount} exp, you only have ${authorRank.experience}`)
      return false
    }

    authorRank.removeExperience(amount)
    await authorRank.save()

    receiverRank.addExperience(amount)
    await receiverRank.save()

    await message.channel.send(`<@${authorUserId}> gifted ${amount} EXP to <@${receiverUserId}>.`)
    return true
  },
}

export default GiftExpCommand
