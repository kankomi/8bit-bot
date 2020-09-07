import { Message } from 'discord.js';

export interface CommandConfig {
  description?: string;
}

export default class Command {
  name: string;
  config: CommandConfig;

  constructor(name: string, config: CommandConfig) {
    this.name = name;
    this.config = config;
  }

  execute(message: Message, args: string[]) {
    throw new Error('execute is not implemented');
  }
}
