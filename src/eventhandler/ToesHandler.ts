import { Message, Client } from 'discord.js';
import SqliteDatabaseService from '../services/SqliteDatabaseService';
import { ToeCounterRow } from '../types';
import EventHandlerInterface from './EventHandlerInterface';

export default class ToeHandler extends EventHandlerInterface {
  constructor(client: Client) {
    super(client);
    this.name = 'toes';

    this.client.on('message', this.execute);
  }

  async execute(message: Message) {
    if (
      message.client.user?.id === message.author.id ||
      !message.content.toLowerCase().includes('toes')
    )
      return;
    message.react('👌');

    const authorId = message.author.id;
    const db = await SqliteDatabaseService.getDatabase();

    if (!db) {
      console.error('db is not configured!');
      return;
    }

    const row = await db.get<ToeCounterRow>(
      'SELECT * FROM ToeCounter WHERE userId = ?',
      authorId
    );

    if (!row) {
      await db.exec(`INSERT INTO ToeCounter VALUES ("${authorId}", 1)`);
    } else {
      const newCount = row.toeCount + 1;
      await db.run(
        `UPDATE ToeCounter SET toeCount = ? WHERE userId = ?`,
        newCount,
        authorId
      );
    }
  }
}
