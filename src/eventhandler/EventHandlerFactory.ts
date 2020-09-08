import { Collection, Client } from 'discord.js';
import fs from 'fs';
import path from 'path';
import EventHandlerInterface from './EventHandlerInterface';
import logger from '../logging';

export default class EventHandlerFactory {
  private static handler = new Collection<string, EventHandlerInterface>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static async initialize(client: Client) {
    const commandFiles = fs
      .readdirSync(__dirname)
      .filter((f) => f.match(/.*Handler\.ts$/));

    for (const file of commandFiles) {
      const HandlerClass = (await import(path.join(__dirname, file))).default;
      const listener: EventHandlerInterface = new HandlerClass(client);

      this.handler.set(listener.name, listener);

      logger.info(`Loaded event listener '${listener.name}'.`);
    }
  }
}
