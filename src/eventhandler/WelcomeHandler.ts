import EventHandlerInterface from './EventHandlerInterface';
import {
  Client,
  Guild,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';

export default class WelcomeHandler extends EventHandlerInterface {
  constructor(client: Client) {
    super(client);
    this.name = 'welcome';
    this.client.on('guildMemberAdd', this.welcome);
  }

  welcome(member: GuildMember | PartialGuildMember): void {
    const introChannel = member.guild.channels.cache.find(
      (c) => c.name === 'introductions'
    );

    if (!introChannel) {
      return;
    }

    const generalChannel = member.guild.channels.cache.find(
      (c) => c.name === 'general'
    ) as TextChannel | undefined;

    if (!generalChannel) {
      return;
    }

    generalChannel.send(
      `Welcome <@${member.id}>! Please write a short introduction in <#${introChannel.id}>, so we get to know you better`
    );
  }
}