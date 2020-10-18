import { Message } from 'discord.js'
import fs from 'fs'
import { prefix } from '../config.json'
import { Command } from '../types'

async function loadCommands(): Promise<Command[]> {
  const promises: Promise<any>[] = []

  for (const file of fs.readdirSync(__dirname)) {
    promises.push(import(`./${file}`))
  }

  const cmds = await Promise.all(promises)
  return cmds.reduce<Command[]>((prev, cur) => [...prev, cur.default], [])
}

function buildHelpString(commands: Command[], padding: number = 3) {
  let longestName = 0
  let longestAliases = 0
  let longestUsage = 0

  for (const c of commands) {
    longestName = Math.max(longestName, c.name.length)
    longestAliases = Math.max(longestAliases, c.aliases ? c.aliases.join(', ').length : 0)
    longestUsage = Math.max(longestUsage, c.usage.length)
  }

  longestName += padding
  longestUsage += padding
  longestAliases += padding

  // build header
  let str = `command${' '.repeat(longestName - 7)}`
  str += `usage${' '.repeat(longestUsage - 5)}`
  str += `aliases${' '.repeat(longestAliases - 7)}`
  str += 'description\n'

  // helper function
  const buildLine = (cmd: string, aliases: string, usage: string, description: string) => {
    let out = ''
    out += `${cmd}${' '.repeat(longestName - cmd.length)}`
    out += `${usage}${' '.repeat(longestUsage - usage.length)}`
    out += `${aliases}${' '.repeat(longestAliases - aliases.length)}`
    out += `${description}`
    return out
  }

  // build help body
  for (const c of commands) {
    str += buildLine(c.name, c.aliases ? c.aliases.join(', ') : '', c.usage, c.description)
    str += '\n'
  }

  return str
}

const HelpCommand: Command = {
  name: 'help',
  usage: `${prefix}help`,
  args: false,
  cooldown: 0,
  description: 'Shows this help',
  async execute(message: Message) {
    /*
    command   aliases   usage     description
    help      [h]       !!help    Displays the help.
    */
    const commands = await loadCommands()

    let helpStr = '8bit-Bot commands:\n```'
    helpStr += buildHelpString(commands, 2)
    helpStr += '```'

    message.channel.send(helpStr)
    return true
  },
}

export default HelpCommand
