import { Message } from 'discord.js';
import { SqliteDatabase } from '../types';

export interface MessageListenerConfig {
  description: string;
  database: SqliteDatabase;
}

export default class MessageListener {
  name: string = '';
  config?: MessageListenerConfig;

  constructor(config?: MessageListenerConfig) {
    this.config = config;
  }

  execute(message: Message) {
    // does nothing
  }
}
