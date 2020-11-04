import { Client, Collection, Message, MessageReaction, PartialUser, User } from 'discord.js'
import { getConfig } from '../services/config'
import logger from '../utils/logging'
import EventHandlerInterface from './EventHandlerInterface'

export default class RoleHandler extends EventHandlerInterface {
  inVoiceChatTimestamps = new Collection<string, number>()

  constructor(client: Client) {
    super(client, 'roles')

    client.on('messageReactionAdd', (reaction, user) => {
      this.onReactionAdd(reaction, user)
    })
    client.on('messageReactionRemove', (reaction, user) => {
      this.onReactionRemove(reaction, user)
    })
  }

  parseRoleAndEmojis(message: string): { [emojiIdentifier: string]: string } {
    return message.split('\n').reduce<{ [emojiIdentifier: string]: string }>((acc, cur) => {
      const m = cur.split(' - ')

      if (m.length < 2) {
        return acc
      }

      return {
        ...acc,
        [m[1].trim()]: m[0].trim(),
      }
    }, {})
  }

  async onReactionRemove(reaction: MessageReaction, user: User | PartialUser) {
    this.addOrRemoveRole(reaction, user, false)
  }

  async onReactionAdd(reaction: MessageReaction, user: User | PartialUser) {
    this.addOrRemoveRole(reaction, user, true)
  }

  async addOrRemoveRole(reaction: MessageReaction, user: User | PartialUser, add: boolean) {
    const message = await reaction.message.fetch()
    const guildId = message.guild?.id
    const emojiIdentifier = reaction.emoji.identifier

    // ignore bots
    if (user.bot) {
      return
    }

    if (!guildId) {
      logger.warn('cannot get guild id in onReaction')
      return
    }
    const guild = this.client.guilds.cache.get(guildId)

    if (!guild) {
      logger.warn(`Cannot find guild with id ${guildId}`)
      return
    }

    const config = await getConfig(guildId)
    if (!config) {
      logger.error(`cannot get config for guildId ${guildId} in role handler`)
      return
    }

    if (message.id !== config.rankMessageId) {
      return
    }

    const roles = this.parseRoleAndEmojis(message.content)
    const roleName = roles[`<:${emojiIdentifier}>`] || roles[decodeURIComponent(emojiIdentifier)]

    if (!roleName) {
      logger.info(`emoji ${emojiIdentifier} is not in rank list, ignoring...`)
      return
    }

    const guildRole = guild.roles.cache.find((r) => r.name === roleName)

    if (!guildRole) {
      logger.error(`cannot parse guild role ${roleName} for guild ${guildId}`)
      return
    }

    if (add) {
      const member = await guild.members.cache.get(user.id)?.roles.add(guildRole)
      if (!member) {
        logger.error(`could not add role ${guildRole.name} to member ${user.username}`)
      } else {
        logger.info(`Added role ${guildRole.name} to user ${user.username} in guild ${guild.name}`)
      }
    } else {
      const member = await guild.members.cache.get(user.id)?.roles.remove(guildRole)
      if (!member) {
        logger.error(`could not remove role ${guildRole.name} to member ${user.username}`)
      } else {
        logger.info(
          `Removed role ${guildRole.name} from user ${user.username} in guild ${guild.name}`
        )
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onMessage(message: Message) {
    // not implemented
  }
}
