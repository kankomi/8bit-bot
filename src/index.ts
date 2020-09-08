import Discord, { Client } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import Command from './commands/Command';
import SqliteDatabaseService from './services/SqliteDatabaseService';
import EventHandlerFactory from './eventhandler/EventHandlerFactory';
import { Command } from './types';
import { prefix } from './config.json';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

async function loadCommands(): Promise<Discord.Collection<string, Command>> {
  const commands = new Discord.Collection<string, Command>();
  const commandFiles = fs
    .readdirSync(`./src/commands`)
    .filter((f) => f.match(/.*\.ts$/) && !f.match(/^Command\.[js|ts]/));

  for (const file of commandFiles) {
    const command: Command = (await import(`./commands/${file}`)).default;

    commands.set(command.name, command);

    console.log(`Loaded command '${command.name}'.`);
  }

  return commands;
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
  await EventHandlerFactory.initialize(client);

  client.on('message', (message) => {
    const messageContent = message.content.trim().replace(/\s+/, ' ');
    const [cmd, ...args] = messageContent
      .substring(prefix.length)
      .trim()
      .split(' ');

    if (!messageContent.startsWith(prefix)) return;

    if (!commands.has(cmd)) {
      message.reply(`command '${cmd}' does not exist!`);
      return;
    }

    commands.get(cmd)?.execute(message, args);
  });

  client.login(BOT_TOKEN);
})();
