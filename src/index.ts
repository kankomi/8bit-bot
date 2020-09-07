import Discord from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import Command from './commands/Command';
import MessageListener from './messageListener/MessageListener';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { SqliteDatabase } from './types';
import SqliteDatabaseService from './services/SqliteDatabaseService';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const PREFIX = '!bit';

async function loadCommands(): Promise<Discord.Collection<string, Command>> {
  const commands = new Discord.Collection<string, Command>();

  const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((f) => f.endsWith('.ts') && f !== 'Command.ts');

  for (const file of commandFiles) {
    const CommandClass = (await import(`./commands/${file}`)).default;
    const command: Command = new CommandClass();

    commands.set(command.name, command);

    console.log(`Loaded command '${command.name}'.`);
  }

  return commands;
}

async function loadMessageListener(): Promise<
  Discord.Collection<string, MessageListener>
> {
  const messageListener = new Discord.Collection<string, MessageListener>();

  const commandFiles = fs
    .readdirSync('./src/messageListener')
    .filter((f) => f.endsWith('.ts') && f !== 'MessageListener.ts');

  for (const file of commandFiles) {
    const ListenerClass = (await import(`./messageListener/${file}`)).default;
    const listener: MessageListener = new ListenerClass();

    messageListener.set(listener.name, listener);

    console.log(`Loaded message listener '${listener.name}'.`);
  }

  return messageListener;
}

function setupClient(client: Discord.Client): void {
  client
    .on('error', console.error)
    .on('warn', console.warn)
    //   .on('debug', console.log)
    .on('ready', () => {
      console.log(
        `Client ready; logged in as ${client.user?.username}#${client.user?.discriminator} (${client.user?.id})`
      );
    })
    .on('disconnect', () => {
      console.warn('Disconnected!');
    })
    .on('reconnecting', () => {
      console.warn('Reconnecting...');
    });
}

(async function main() {
  const client = new Discord.Client();
  setupClient(client);
  await SqliteDatabaseService.getDatabase();
  const commands = await loadCommands();
  const messageListener = await loadMessageListener();

  client.on('message', (message) => {
    const messageContent = message.content.trim().replace(/\s+/, ' ');
    const [cmd, ...args] = messageContent
      .substring(PREFIX.length)
      .trim()
      .split(' ');

    // execute message listeners
    for (const l of messageListener.array()) {
      l.execute(message);
    }

    if (!messageContent.startsWith(PREFIX)) return;

    if (!commands.has(cmd)) {
      message.reply(`command '${cmd}' does not exist!`);
      return;
    }

    commands.get(cmd)?.execute(message, args);
  });

  client.login(BOT_TOKEN);
})();
