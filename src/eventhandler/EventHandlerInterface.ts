import { Client } from 'discord.js';

export default abstract class EventHandlerInterface {
  name: string = 'unknown';
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
