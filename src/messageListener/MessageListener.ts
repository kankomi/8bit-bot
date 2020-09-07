import { Message } from 'discord.js';
import { SqliteDatabase } from '../types';

export interface MessageListenerConfig {
  description: string;
}

export default class MessageListener {
  name: string;
  config?: MessageListenerConfig;

  constructor(name: string, config?: MessageListenerConfig) {
    this.config = config;
    this.name = name;
  }

  execute(message: Message) {
    // does nothing
  }
}
