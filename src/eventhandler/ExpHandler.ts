import { Message, Client } from 'discord.js';
import EventHandlerInterface from './EventHandlerInterface';
import Ranking from '../db/models/Ranking';

import { prefix } from '../config.json';

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
  constructor(client: Client) {
    super(client);
    this.name = 'exp';

    this.client.on('message', this.execute);
  }

  // eslint-disable-next-line class-methods-use-this
  async execute(message: Message) {
    const userId = message.author.id;
    const guildId = message.guild?.id;

    if (message.author.bot === true || message.content.startsWith(prefix)) {
      return;
    }

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
