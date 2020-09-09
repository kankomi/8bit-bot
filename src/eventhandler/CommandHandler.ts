import { Client, Collection, Message } from 'discord.js';
import fs from 'fs';
import { Command } from '../types';
import EventHandlerInterface from './EventHandlerInterface';
import logger from '../logging';
import { prefix } from '../config.json';

export default class CommandHandler extends EventHandlerInterface {
  commands = new Collection<string, Command>();
  cooldowns = new Collection<string, Collection<string, number>>();

  constructor(client: Client) {
    super(client);
    this.name = 'Command Handler';
    this.loadCommands();
    this.client.on('message', (message) => this.onMessage(message));
  }

  async loadCommands() {
    const commandFiles = fs.readdirSync('./src/commands').filter((f) => f.endsWith('.ts'));

    for (const file of commandFiles) {
      // eslint-disable-next-line no-await-in-loop
      const command: Command | undefined = (await import(`../commands/${file}`)).default;

      if (command && command.execute) {
        this.commands.set(command.name, command);
        logger.info(`Loaded command '${command.name}'.`);
      }
    }
  }

  onMessage(message: Message) {
    if (message.author.bot || !message.content.startsWith(prefix)) {
      return;
    }

    const messageContent = message.content.replace(/\s+/, ' ').trim();
    const [cmd, ...args] = messageContent.substring(prefix.length).split(' ');

    if (!this.commands.has(cmd)) {
      message.reply(`command '${cmd}' does not exist!`);
      return;
    }

    const command = this.commands.get(cmd) as Command;

    if (!this.checkArguments(message, command, args) || !this.checkCooldown(message, command)) {
      return;
    }

    this.commands.get(cmd)?.execute(message, args);
  }

  checkArguments(message: Message, command: Command, args: string[]): Boolean {
    if (command.args && args.length === 0) {
      message.reply(`command arguments are missing, usage is \`${prefix}${command.name} ${command.usage}`);

      return false;
    }

    return true;
  }

  checkCooldown(message: Message, command: Command): boolean {
    if (!this.cooldowns.has(command.name)) {
      this.cooldowns.set(command.name, new Collection<string, number>());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(command.name) as Collection<string, number>;
    const cooldownAmount = command.cooldown * 1000;

    if (timestamps?.has(message.author.id)) {
      const expirationTime = (timestamps.get(message.author.id) as number) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        message.reply(`please wait ${timeLeft.toFixed(0)} more second(s) before using \`${command.name}\` again.`);

        return false;
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    return true;
  }
}
