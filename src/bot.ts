import Discord from 'discord.js'
import dotenv from 'dotenv'
import { initializeDb } from './db'
import EventHandlerFactory from './eventhandler/EventHandlerFactory'
import logger from './utils/logging'

dotenv.config()

const { BOT_TOKEN } = process.env

function setupClient(client: Discord.Client): void {
  client
    .on('error', logger.error)
    .on('warn', logger.warn)
    //   .on('debug', logger.info)
    .on('ready', () => {
      logger.info(
        `Client ready; logged in as ${client.user?.username}#${client.user?.discriminator} (${client.user?.id})`
      )
      client.user?.setActivity('!!help - Gimme toes!', { type: 'PLAYING' })
    })
    .on('disconnect', () => {
      logger.warn('Disconnected!')
    })
    .on('reconnecting', () => {
      logger.warn('Reconnecting...')
    })
}

async function main() {
  const client = new Discord.Client({
    partials: ['GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  })
  setupClient(client)
  await EventHandlerFactory.initialize(client)
  await initializeDb()

  try {
    await client.login(BOT_TOKEN)
  } catch (ex) {
    logger.error(`Cannot login discord bot: "${ex}", token was ${BOT_TOKEN}`)
  }
}

main()
