import { Message } from 'discord.js';
import { Command } from '../types';
import Ranking from '../db/models/Ranking';
import logger from '../logging';
import { LEVELS } from '../eventhandler/ExpHandler';
import { getUserFromMention } from '../utils';

const RankingCommand: Command = {
  name: 'rank',
  usage: 'rank [@user]',
  description: 'Shows the rank of a user',
  async execute(message: Message, args: string[]) {
    if (message.author.bot) {
      return;
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!');
      return;
    }

    let userId = message.author.id;
    const guildId = message.guild.id;
    if (args.length > 0) {
      const user = getUserFromMention(message.client, args[0]);
      if (!user) {
        message.channel.send(`Cannot find user ${args[0]}`);
        return;
      }
      userId = user.id;
    }

    let rank = await Ranking.findOne({
      where: { userId, guildId },
    });

    if (!rank) {
      rank = await Ranking.create({
        userId,
        guildId,
      });

      if (rank === null) {
        logger.error(
          `Could not create ranking for user ${userId} in guild ${guildId}`
        );
      }
    }

    message.channel.send(
      `<@${userId}> is level ${rank.level}, EXP ${rank.experience}/${
        LEVELS[rank.level + 1]
      }`
    );
  },
};

export default RankingCommand;
