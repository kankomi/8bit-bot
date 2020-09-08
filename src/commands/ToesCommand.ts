import { getUserFromMention } from '../utils';
import ToeCounter from '../db/models/ToeCounter';
import { Message } from 'discord.js';
import { Command } from '../types';
import { prefix } from '../config.json';

const ToesCommand: Command = {
  name: 'toes',
  usage: `toes @user`,
  description: 'Shows how many times @user mentioned toes',

  async execute(message: Message, args: string[]) {
    const [userMention] = args;

    const user = getUserFromMention(message.client, userMention);
    if (!user) {
      message.channel.send(`cannot find user ${userMention}`);
      return;
    }

    const result = await ToeCounter.findOne({ where: { userId: user.id } });

    if (!result) {
      message.channel.send(`${user.username} didn't mention toes even once!`);
    } else {
      message.channel.send(
        `${user.username} mentioned toes ${result.count} times!`
      );
    }
  },
};

export default ToesCommand;
