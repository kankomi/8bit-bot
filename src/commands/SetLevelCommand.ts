import { Message } from 'discord.js';
import Ranking from '../db/models/Ranking';
import logger from '../utils/logging';
import { Command } from '../types';
import { MAX_LEVEL } from '../utils/experience';
import { prefix } from '../config.json';

async function getOrCreateRanking(userId: string, guildId: string): Promise<Ranking | undefined> {
  let ranking = await Ranking.findOne({
    where: { userId, guildId },
  });

  if (!ranking) {
    ranking = await Ranking.create({
      userId,
      guildId,
    });

    if (ranking === null) {
      logger.error(`Could not create ranking for user ${userId} in guild ${guildId}`);
      return undefined;
    }
  }

  return ranking;
}

const SetLevelCommand: Command = {
  name: 'setlevel',
  usage: `${prefix}setlevel [@user] [level]`,
  aliases: ['setl', 'setlvl'],
  cooldown: 0,
  args: true,
  permission: 'MANAGE_CHANNELS',
  description: 'Set [@user]s level to [level]',
  async execute(message: Message, args: string[]) {
    if (message.author.bot) {
      return;
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!');
      return;
    }

    if (args.length < 2) {
      message.reply('need `[user] [level]` as argument');
      return;
    }

    const level = parseInt(args[1], 10);

    if (isNaN(level) || level < 0 || level > MAX_LEVEL) {
      message.reply(
        `${args[1]} is an invalid level, need a positive number between 0 and ${MAX_LEVEL}`
      );
      return;
    }

    const authorUserId = message.author.id;
    const receiverUserId = message.mentions.users.first()?.id;
    const guildId = message.guild.id;

    if (!receiverUserId) {
      message.channel.send(`Cannot find user ${args[0]}`);
      return;
    }

    const receiverRank = await getOrCreateRanking(receiverUserId, guildId);

    if (!receiverRank) {
      logger.warn('Cannot get receiver');
      return;
    }

    receiverRank.setLevel(level);
    await receiverRank.save();

    message.channel.send(`<@${authorUserId}> set <@${receiverUserId}>'s level to ${level}.`);
  },
};

export default SetLevelCommand;
