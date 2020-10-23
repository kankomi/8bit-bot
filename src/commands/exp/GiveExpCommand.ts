// import { Message } from 'discord.js'
// import { prefix } from '../../config.json'
// import Ranking from '../../db/models/Ranking'
// import { Command } from '../../types'
// import logger from '../../utils/logging'

// const GiveExpCommand: Command = {
//   name: 'give',
//   usage: `${prefix}give [@user] [amount]`,
//   cooldown: 0,
//   args: true,
//   permission: 'MANAGE_CHANNELS',
//   description: 'Give [amount] exp to [@user]',
//   async execute(message: Message, args: string[]) {
//     if (message.author.bot) {
//       return false
//     }

//     if (message.guild === null) {
//       logger.warn('Cannot get guild id!')
//       return false
//     }

//     if (args.length < 2) {
//       message.reply('need `[user] [amount]` as argument')
//       return false
//     }

//     const amount = parseInt(args[1], 10)

//     if (isNaN(amount) || amount < 0) {
//       message.reply(`${args[1]} is an invalid amount, need a positive number`)
//       return false
//     }

//     const authorUserId = message.author.id
//     const receiverUserId = message.mentions.users.first()?.id
//     const guildId = message.guild.id

//     if (!receiverUserId) {
//       message.channel.send(`Cannot find user ${args[0]}`)
//       return false
//     }

//     const receiverRank = await Ranking.getOrCreateRanking(receiverUserId, guildId)

//     if (!receiverRank) {
//       logger.warn('Cannot get receiver')
//       return false
//     }

//     receiverRank.addExperience(amount)
//     await receiverRank.save()

//     await message.channel.send(`<@${authorUserId}> gave ${amount} EXP to <@${receiverUserId}>.`)
//     return true
//   },
// }

// export default GiveExpCommand
