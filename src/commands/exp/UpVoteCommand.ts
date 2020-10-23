// import { Message } from 'discord.js'
// import { prefix, experience } from '../../config.json'
// import Ranking from '../../db/models/Ranking'
// import { Command } from '../../types'
// import logger from '../../utils/logging'

// const RankingCommand: Command = {
//   name: 'up',
//   usage: `${prefix}up [@user]`,
//   cooldown: 30 * 60, // once per 30 minutes
//   args: true,
//   description: 'Upvotes a user',
//   async execute(message: Message, args: string[]) {
//     if (message.author.bot) {
//       return false
//     }

//     if (message.guild === null) {
//       logger.warn('Cannot get guild id!')
//       return false
//     }

//     if (args.length < 1) {
//       logger.warn('No arguments given!')
//       return false
//     }

//     const user = message.mentions.members?.first()?.user
//     if (!user) {
//       message.channel.send(`Cannot find user ${args[0]}`)
//       return false
//     }

//     const guildId = message.guild.id
//     const userId = user.id

//     if (userId === message.author.id) {
//       message.reply('You cannot upvote yourself! Jeez ego much...')
//       return false
//     }

//     const rank = await Ranking.getOrCreateRanking(userId, guildId)

//     if (!rank) {
//       logger.error(`Could not create ranking for user ${userId} in guild ${guildId}`)

//       return false
//     }

//     rank.addExperience(experience.UPVOTE_EXP)
//     await rank.save()

//     await message.channel.send(`${message.author.username} upvoted ${user.username}!`)

//     logger.info(
//       `${message.author.username} upvoted ${user.username} with ${experience.UPVOTE_EXP} exp`
//     )
//     return true
//   },
// }

// export default RankingCommand
