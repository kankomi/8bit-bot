import { BitFieldResolvable, Client, Message, PermissionString } from 'discord.js';

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
  permission?: BitFieldResolvable<PermissionString>;
  execute(message: Message, args: string[]): any;
};
