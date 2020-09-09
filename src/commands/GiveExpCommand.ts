import { Message } from 'discord.js';
import Ranking from '../db/models/Ranking';
import logger from '../logging';
import { Command } from '../types';

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

const GiveExpCommand: Command = {
  name: 'give',
  usage: '[@user] [amount]',
  cooldown: 0,
  args: true,
  permission: 'MANAGE_CHANNELS',
  description: 'Give [amount] exp to [@user]',
  async execute(message: Message, args: string[]) {
    if (message.author.bot) {
      return;
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!');
      return;
    }

    if (args.length < 2) {
      message.reply('need `[user] [amount]` as argument');
      return;
    }

    const amount = parseInt(args[1], 10);

    if (isNaN(amount) || amount < 0) {
      message.reply(`${args[1]} is an invalid amount, need a positive number`);
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

    receiverRank.addExperience(amount);
    await receiverRank.save();

    message.channel.send(`<@${authorUserId}> gave ${amount} EXP to <@${receiverUserId}>.`);
  },
};

export default GiveExpCommand;
