import { Message, Client } from 'discord.js';
import EventHandlerInterface from './EventHandlerInterface';
import ToeCounter from '../db/models/ToeCounter';
import { prefix } from '../config.json';

export default class ToeHandler extends EventHandlerInterface {
  constructor(client: Client) {
    super(client);
    this.name = 'toes';

    this.client.on('message', this.execute);
  }

  // eslint-disable-next-line class-methods-use-this
  async execute(message: Message) {
    if (
      message.content.startsWith(prefix) ||
      message.client.user?.id === message.author.id ||
      !message.content.toLowerCase().includes('toes')
    ) {
      return;
    }
    message.react('👌');

    const userId = message.author.id;
    const result = await ToeCounter.findOne({ where: { userId } });

    if (!result) {
      await ToeCounter.create({ userId, count: 1 });
    } else {
      result.count += 1;
      await result.save();
    }
  }
}
