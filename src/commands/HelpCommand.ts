import fs from 'fs';
import { Message } from 'discord.js';
import { Command } from '../types';

import { prefix } from '../config.json';

async function loadCommands(): Promise<Command[]> {
  const promises: Promise<any>[] = [];

  for (const file of fs.readdirSync(__dirname)) {
    promises.push(import(`./${file}`));
  }

  const cmds = await Promise.all(promises);
  return cmds.reduce<Command[]>((prev, cur) => [...prev, cur.default], []);
}

const HelpCommand: Command = {
  name: 'help',
  usage: 'help',
  description: 'Shows this help',
  async execute(message: Message) {
    const commands = await loadCommands();

    let helpStr = `8bit-Bot commands:
\`\`\`
`;
    for (const cmd of commands) {
      helpStr += `${prefix}${cmd.usage}        - ${cmd.description}\n`;
    }

    helpStr += '```';

    message.channel.send(helpStr);
  },
};

export default HelpCommand;
