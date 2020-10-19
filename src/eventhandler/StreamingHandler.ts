import { Client, Message, Presence, TextChannel } from 'discord.js'
import _ from 'lodash'
import logger from '../utils/logging'
import TimeoutCache from '../utils/TimeoutCache'
import EventHandlerInterface from './EventHandlerInterface'

export default class ToeHandler extends EventHandlerInterface {
  messageTimestampCache = new TimeoutCache(6 * 60)
  constructor(client: Client) {
    super(client, 'streaming')
    this.name = 'streaming'
    this.client.on('presenceUpdate', (oldPresence, newPresence) => {
      const newBitRole = newPresence.member?.roles.cache.find(
        (r) => r.name.toLowerCase() === 'new-bit'
      )

      if (newBitRole !== undefined || _.isEqual(oldPresence?.activities, newPresence.activities)) {
        return
      }

      this.onPresenceUpdate(newPresence)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onMessage(message: Message) {
    // no implementation
  }

  async onPresenceUpdate(presence: Presence) {
    const streamingActivity = presence.activities.find((a) => a.type === 'STREAMING')

    if (!streamingActivity) {
      return
    }

    if (!this.messageTimestampCache.isExpired(presence.userID)) {
      return
    }

    logger.info(`found streaming activity ${streamingActivity} with url ${streamingActivity.url}`)

    if (streamingActivity.url !== null && presence.guild !== null) {
      const channel = presence.guild.channels.cache.find(
        (chan) => chan.name.includes('stream') || chan.name.includes('twitch')
      )

      if (channel && channel.type === 'text') {
        await (channel as TextChannel).send(
          `${presence.user?.username} is streaming!\nCheck it out at ${streamingActivity.url}`
        )

        // set cooldown for this user
        this.messageTimestampCache.set(presence.userID)

        logger.info(
          `Posted streaming activity from user ${presence.user?.username} to guild ${presence.guild} in channel ${channel.name}.`
        )
      }
    }
  }
}
