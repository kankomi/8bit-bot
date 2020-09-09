import { Message } from 'discord.js';
import Ranking from '../db/models/Ranking';
import { getExpForLevel } from '../experience';
import logger from '../logging';
import { Command } from '../types';
import { getUserFromMention } from '../utils';

const RankingCommand: Command = {
  name: 'rank',
  usage: '[@user]',
  cooldown: 0,
  args: false,
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
        logger.error(`Could not create ranking for user ${userId} in guild ${guildId}`);
      }
    }

    message.channel.send(
      `<@${userId}> is level ${rank.level}, EXP ${rank.experience}/${getExpForLevel(
        rank.level + 1
      )}`
    );
  },
};

export default RankingCommand;
