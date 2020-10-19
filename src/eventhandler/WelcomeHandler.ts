import { Client, GuildMember, Message, PartialGuildMember, TextChannel } from 'discord.js'
import EventHandlerInterface from './EventHandlerInterface'

export default class WelcomeHandler extends EventHandlerInterface {
  constructor(client: Client) {
    super(client, 'welcome')
    this.name = 'welcome'
    // deactivated
    // this.client.on('guildMemberAdd', this.welcome);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onMessage(message: Message) {
    // no implementation
  }

  // eslint-disable-next-line class-methods-use-this
  welcome(member: GuildMember | PartialGuildMember): void {
    const introChannel = member.guild.channels.cache.find((c) => c.name === 'introductions')

    if (!introChannel) {
      return
    }

    const generalChannel = member.guild.channels.cache.find((c) => c.name === 'general') as
      | TextChannel
      | undefined

    if (!generalChannel) {
      return
    }

    generalChannel.send(
      `Welcome <@${member.id}>! Please write a short introduction in <#${introChannel.id}>, so we get to know you better`
    )
  }
}
