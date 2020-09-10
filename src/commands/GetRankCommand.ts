import { Message } from 'discord.js';
import Ranking from '../db/models/Ranking';
import { getExpForLevel } from '../utils/experience';
import logger from '../utils/logging';
import { Command } from '../types';
import { prefix } from '../config.json';

const RankingCommand: Command = {
  name: 'rank',
  usage: `${prefix}rank [@user]`,
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
    let { username } = message.author;
    const guildId = message.guild.id;
    if (args.length > 0) {
      const user = message.mentions.members?.first()?.user;
      if (!user) {
        message.channel.send(`Cannot find user ${args[0]}`);
        return;
      }
      userId = user.id;
      username = user.username;
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
      `\`${username} is level ${rank.level} with ${
        rank.experience
      } EXP. EXP needed for next level: ${getExpForLevel(rank.level + 1)}.\``
    );
  },
};

export default RankingCommand;
