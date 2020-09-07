import { Collection, Client } from 'discord.js';
import fs from 'fs';
import path from 'path';
import EventHandlerInterface from './EventHandlerInterface';

export default class EventHandlerFactory {
  private static handler = new Collection<string, EventHandlerInterface>();
  private constructor() {}

  static async initialize(client: Client) {
    const commandFiles = fs
      .readdirSync(__dirname)
      .filter((f) => f.match(/.*Handler\.ts$/));

    for (const file of commandFiles) {
      const HandlerClass = (await import(path.join(__dirname, file))).default;
      const listener: EventHandlerInterface = new HandlerClass(client);

      this.handler.set(listener.name, listener);

      console.log(`Loaded event listener '${listener.name}'.`);
    }
  }
}
