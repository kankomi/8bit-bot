import { Message } from 'discord.js'
import ToeCounter from '../db/models/ToeCounter'
import { Command } from '../types'
import { prefix } from '../config.json'

const ToesCommand: Command = {
  name: 'toes',
  usage: `${prefix}toes [@user](optional)`,
  args: false,
  cooldown: 10,
  description: 'Shows how many times @user mentioned toes',

  async execute(message: Message, args: string[]) {
    let user = message.author

    if (args.length > 0) {
      const mentionedUser = message.mentions.users.first()

      if (!mentionedUser) {
        message.reply(`Cannot find user \`${args[0]}\``)
        return false
      }
      user = mentionedUser
    }

    const result = await ToeCounter.findOne({ where: { userId: user.id } })

    if (!result) {
      await message.channel.send(`${user.username} didn't mention toes even once!`)
    } else {
      await message.channel.send(`${user.username} mentioned toes ${result.count} times!`)
    }

    return true
  },
}

export default ToesCommand
