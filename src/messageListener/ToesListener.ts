import { Message } from 'discord.js';
import MessageListener from './MessageListener';
import { SqliteDatabase } from '../types';

type ToeCounterRow = {
  userId: string;
  toeCount: number;
};

export default class ToesFunction extends MessageListener {
  constructor(db: SqliteDatabase) {
    super({ description: 'Listens for toes', database: db });
    this.name = 'toes';
  }

  async execute(message: Message) {
    if (!message.content.toLowerCase().includes('toes')) return;
    message.react('👌');

    const authorId = message.author.id;
    const db = this.config?.database;

    if (!db) {
      console.error('db is not configured!');
      return;
    }

    console.log(db);

    let res = await db.all<ToeCounterRow>(
      'SELECT toeCount from ToeCounter WHERE userId = ?',
      authorId
    );

    if (!res) {
      await db.exec(`INSERT INTO ToeCounter VALUES ("${authorId}", 1)`);
    } else {
      const newCount = res.toeCount + 1;
      await db.run(
        `UPDATE ToeCounter SET toeCount = ? WHERE where authorId = ?`,
        newCount,
        authorId
      );
    }
  }
}
