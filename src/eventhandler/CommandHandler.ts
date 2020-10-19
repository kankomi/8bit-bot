import { Client, Collection, Message } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { prefix } from '../config.json'
import { Command } from '../types'
import logger from '../utils/logging'
import EventHandlerInterface from './EventHandlerInterface'

export default class CommandHandler extends EventHandlerInterface {
  static commands = new Collection<string, Command>()
  cooldowns = new Collection<string, Collection<string, number>>()

  constructor(client: Client) {
    super(client, 'Command Handler')
    this.loadCommands()
  }

  getCommandFiles(folder: string): string[] {
    const d = fs.readdirSync(folder)

    return d.reduce<string[]>((acc, cur) => {
      const filePath = path.join(folder, cur)

      if (fs.lstatSync(filePath).isDirectory()) {
        return [...acc, ...this.getCommandFiles(filePath)]
      }

      if (!cur.includes('Command')) {
        return acc
      }

      // make filepath relative to this file
      const relativeFilePath = filePath.replace(path.dirname(__dirname), '..')
      return [...acc, relativeFilePath]
    }, [])
  }

  async loadCommands() {
    const commandFiledir = path.join(path.dirname(__dirname), 'commands')
    const commandFiles = this.getCommandFiles(commandFiledir)

    for (const file of commandFiles) {
      // eslint-disable-next-line no-await-in-loop
      const command: Command | undefined = (await import(file)).default

      if (command && command.execute) {
        CommandHandler.commands.set(command.name, command)
        logger.info(`Loaded command '${command.name}'.`)
      }
    }
  }

  async onMessage(message: Message) {
    if (message.author.bot || !message.content.startsWith(prefix)) {
      return
    }

    const messageContent = message.content.replace(/\s+/, ' ').trim()
    const [cmd, ...args] = messageContent.substring(prefix.length).split(' ')

    const command = CommandHandler.commands.find(
      (c) => c.name === cmd || !!c.aliases?.includes(cmd)
    )

    if (!command) {
      message.reply(`command '${cmd}' does not exist!`)
      return
    }

    if (command.permission) {
      const member = message.guild?.members.cache.get(message.author.id)
      if (member) {
        if (!member.permissions.has(command.permission)) {
          message.reply('you do not have the permissions to execute this command')
          return
        }
      }
    }

    if (!this.checkArguments(message, command, args) || !this.checkCooldown(message, command)) {
      return
    }

    const success = await command.execute(message, args)

    if (success) {
      const timestamps = this.cooldowns.get(command.name) as Collection<string, number>
      timestamps.set(message.author.id, Date.now())

      setTimeout(() => timestamps.delete(message.author.id), command.cooldown * 1000)
    }
  }

  checkArguments(message: Message, command: Command, args: string[]): Boolean {
    if (command.args && args.length === 0) {
      message.reply(
        `command arguments are missing, usage is \`${prefix}${command.name} ${command.usage}\``
      )

      return false
    }

    return true
  }

  checkCooldown(message: Message, command: Command): boolean {
    if (!this.cooldowns.has(command.name)) {
      this.cooldowns.set(command.name, new Collection<string, number>())
    }

    const now = Date.now()
    const timestamps = this.cooldowns.get(command.name) as Collection<string, number>
    const cooldownAmount = command.cooldown * 1000

    if (timestamps?.has(message.author.id)) {
      const expirationTime = (timestamps.get(message.author.id) as number) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000

        message.reply(
          `please wait ${timeLeft.toFixed(0)} more second(s) before using \`${
            command.name
          }\` again.`
        )

        return false
      }
    }

    return true
  }
}
