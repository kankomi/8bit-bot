import { Client, Message } from 'discord.js';
import { prefix } from '../config.json';
import Ranking from '../db/models/Ranking';
import EventHandlerInterface from './EventHandlerInterface';

const MAX_LEVEL = 100;
const MAX_LEVEL_EXP = 100000000;
const FIRST_LEVEL_EXP = 1000;

// experience gained
const MESSAGE_EXP = 10;

const B = Math.log(MAX_LEVEL_EXP / FIRST_LEVEL_EXP) / (MAX_LEVEL - 1);
const A = FIRST_LEVEL_EXP / (Math.exp(B) - 1);

function calculateExpForLevel(level: number): number {
  const x = Math.round(A * Math.exp(B * (level - 1)));
  const y = Math.round(A * Math.exp(B * level));

  return y - x - FIRST_LEVEL_EXP;
}

function allLevels() {
  const lvls = [];
  for (let i = 1; i <= MAX_LEVEL; i++) {
    lvls.push(calculateExpForLevel(i));
  }
  return lvls;
}

export const LEVELS = allLevels();

function getLevelForExp(exp: number): number {
  for (let i = 0; i < LEVELS.length; i++) {
    if (LEVELS[i] > exp) {
      return i;
    }
  }
  return MAX_LEVEL;
}

export default class ExpHandler extends EventHandlerInterface {
  messageTimestampCache: { [userId: string]: number } = {};

  constructor(client: Client) {
    super(client);
    this.name = 'exp';

    this.client.on('message', (msg) => {
      this.execute(msg);
    });
  }

  async execute(message: Message) {
    const userId = message.author.id;
    const guildId = message.guild?.id;

    if (message.author.bot === true || message.content.startsWith(prefix)) {
      return;
    }
    const lastMessageTimestamp =
      userId in this.messageTimestampCache
        ? this.messageTimestampCache[userId]
        : undefined;
    if (lastMessageTimestamp && Date.now() - lastMessageTimestamp < 10 * 1000) {
      return;
    }

    this.messageTimestampCache[userId] = message.createdTimestamp;

    const result = await Ranking.findOne({
      where: { userId, guildId },
    });

    if (!result) {
      await Ranking.create({ userId, guildId });
    } else {
      result.experience += MESSAGE_EXP;
      result.level = getLevelForExp(result.experience);
      await result.save();
    }
  }
}
