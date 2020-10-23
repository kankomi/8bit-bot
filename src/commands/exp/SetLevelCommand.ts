// import { Message } from 'discord.js'
// import { prefix } from '../../config.json'
// import Ranking from '../../db/models/Ranking'
// import { Command } from '../../types'
// import { MAX_LEVEL } from '../../utils/experience'
// import logger from '../../utils/logging'

// const SetLevelCommand: Command = {
//   name: 'setlevel',
//   usage: `${prefix}setlevel [@user] [level]`,
//   aliases: ['setl', 'setlvl'],
//   cooldown: 0,
//   args: true,
//   permission: 'MANAGE_CHANNELS',
//   description: 'Set [@user]s level to [level]',
//   async execute(message: Message, args: string[]) {
//     if (message.author.bot) {
//       return false
//     }

//     if (message.guild === null) {
//       logger.warn('Cannot get guild id!')
//       return false
//     }

//     if (args.length < 2) {
//       message.reply('need `[user] [level]` as argument')
//       return false
//     }

//     const level = parseInt(args[1], 10)

//     if (isNaN(level) || level < 0 || level > MAX_LEVEL) {
//       message.reply(
//         `${args[1]} is an invalid level, need a positive number between 0 and ${MAX_LEVEL}`
//       )
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

//     receiverRank.setLevel(level)
//     await receiverRank.save()

//     await message.channel.send(`<@${authorUserId}> set <@${receiverUserId}>'s level to ${level}.`)

//     return true
//   },
// }

// export default SetLevelCommand
