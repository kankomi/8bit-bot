import { Message } from 'discord.js';
import Ranking from '../db/models/Ranking';
import logger from '../logging';
import { Command } from '../types';

const RankingCommand: Command = {
  name: 'rankings',
  usage: 'rankings',
  args: false,
  cooldown: 0,
  description: 'Shows top 10 rank list',
  async execute(message: Message) {
    if (message.author.bot) {
      return;
    }

    if (message.guild === null) {
      logger.warn('Cannot get guild id!');
      return;
    }

    const guildId = message.guild.id;

    const rankings = await Ranking.findAll({
      where: { guildId },
      order: [['level', 'DESC']],
    });

    if (!rankings) {
      message.channel.send('there are no rankings yet.');
      return;
    }

    let str = '';

    for (let i = 0; i < Math.min(rankings.length, 10); i++) {
      const username = message.guild.members.cache.get(rankings[i].userId)?.user.username;
      const rank = rankings[i];
      str += `${i + 1}: ${username} - Level ${rank.level} (${rank.experience} EXP) \n`;
    }

    message.channel.send(`\`\`\`${str}\`\`\``);
  },
};

export default RankingCommand;
