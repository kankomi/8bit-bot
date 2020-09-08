import Discord from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { prefix } from './config.json';
import { initializeDb } from './db';
import EventHandlerFactory from './eventhandler/EventHandlerFactory';
import { Command } from './types';
import logger from './logging';

dotenv.config();

const { BOT_TOKEN } = process.env;

async function loadCommands(): Promise<Discord.Collection<string, Command>> {
  const commands = new Discord.Collection<string, Command>();
  const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((f) => f.match(/.*\.ts$/) && !f.match(/^Command\.[js|ts]/));

  for (const file of commandFiles) {
    // eslint-disable-next-line no-await-in-loop
    const command: Command = (await import(`./commands/${file}`)).default;

    commands.set(command.name, command);

    logger.info(`Loaded command '${command.name}'.`);
  }

  return commands;
}

function setupClient(client: Discord.Client): void {
  client
    .on('error', logger.error)
    .on('warn', logger.warn)
    //   .on('debug', logger.info)
    .on('ready', () => {
      logger.info(
        `Client ready; logged in as ${client.user?.username}#${client.user?.discriminator} (${client.user?.id})`
      );
    })
    .on('disconnect', () => {
      logger.warn('Disconnected!');
    })
    .on('reconnecting', () => {
      logger.warn('Reconnecting...');
    });
}

async function main() {
  const client = new Discord.Client();
  setupClient(client);
  const commands = await loadCommands();
  await EventHandlerFactory.initialize(client);

  await initializeDb();

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
}

main();
