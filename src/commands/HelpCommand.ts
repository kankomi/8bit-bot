import { Message } from 'discord.js';
import Command from './Command';

export default class HelpCommand extends Command {
  constructor() {
    super('help', { description: 'Displays help' });
  }

  execute(message: Message, args: string[]) {
    const prefix = '!bit';

    message.channel.send(`
    8bit-Bot commands:
\`\`\`
${prefix} help              - displays this message
${prefix} toecount @user    - shows how often this user mentioned toes
\`\`\` 
    `);
  }
}
