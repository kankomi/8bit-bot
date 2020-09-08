import { Client, Message } from 'discord.js';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export type SqliteDatabase = Database<sqlite3.Database, sqlite3.Statement>;
export type ToeCounterRow = {
  userId: string;
  toeCount: number;
};

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
