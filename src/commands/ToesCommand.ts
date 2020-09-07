import { Message } from 'discord.js';
import { getUserFromMention } from '../utils';
import Command from './Command';
import SqliteDatabaseService, {
  TABLES,
} from '../services/SqliteDatabaseService';
import { ToeCounterRow } from '../types';

export default class ToesCommand extends Command {
  constructor() {
    super('toecount', { description: 'Gets toes count' });
  }

  async execute(message: Message, args: string[]) {
    console.log(args);
    const [userMention] = args;

    const user = getUserFromMention(message.client, userMention);
    if (!user) {
      message.channel.send(`cannot find user ${userMention}`);
      return;
    }
    const db = await SqliteDatabaseService.getDatabase();

    const row = await db.get<ToeCounterRow>(
      'SELECT * from ToeCounter where userId = ?',
      user.id
    );

    if (!row) {
      message.channel.send(`${user.username} didn't mention toes even once!`);
    } else {
      message.channel.send(
        `${user.username} mentioned toes ${row.toeCount} times!`
      );
    }
  }
}
