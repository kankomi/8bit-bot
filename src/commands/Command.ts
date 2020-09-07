import { Message } from 'discord.js';

export interface CommandConfig {
  description?: string;
}

export default class Command {
  name: string;
  config: CommandConfig = {};

  constructor(name: string, options: CommandConfig = {}) {
    this.name = name;
  }
  execute(message: Message, args: string[]) {
    throw new Error('execute is not implemented');
  }
}
