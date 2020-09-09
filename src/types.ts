import { Client, Message } from 'discord.js';

export type ListenerConfig = {
  description?: string;
  client: Client;
};

export type Command = {
  name: string;
  usage: string;
  description: string;
  args: boolean;
  cooldown: number;
  execute(message: Message, args: string[]): any;
};
