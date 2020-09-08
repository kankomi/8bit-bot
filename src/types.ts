import { Client, Message } from 'discord.js';

export type ListenerConfig = {
  description?: string;
  client: Client;
};

export type Command = {
  name: string;
  usage: string;
  description: string;
  execute(message: Message, args: string[]): void;
};
