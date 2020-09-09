import Discord from 'discord.js';
import dotenv from 'dotenv';
import { initializeDb } from './db';
import EventHandlerFactory from './eventhandler/EventHandlerFactory';
import logger from './logging';

dotenv.config();

const { BOT_TOKEN } = process.env;

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
  const client = new Discord.Client({
    partials: ['GUILD_MEMBER'],
  });
  setupClient(client);
  await EventHandlerFactory.initialize(client);
  await initializeDb();

  client.login(BOT_TOKEN);
}

main();
