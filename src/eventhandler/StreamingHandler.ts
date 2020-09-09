import { Client, Presence, TextChannel } from 'discord.js';
import logger from '../logging';
import EventHandlerInterface from './EventHandlerInterface';
import TimeoutCache from '../TimeoutCache';

export default class ToeHandler extends EventHandlerInterface {
  messageTimestampCache = new TimeoutCache(6 * 60);
  constructor(client: Client) {
    super(client);
    this.name = 'streaming';
    this.client.on('presenceUpdate', (oldPresence, newPresence) => {
      this.onPresenceUpdate(newPresence);
    });
  }

  async onPresenceUpdate(presence: Presence) {
    const streamingActivity = presence.activities.find((a) => a.type === 'STREAMING');

    if (!streamingActivity) {
      return;
    }

    if (!this.messageTimestampCache.isExpired(presence.userID)) {
      return;
    }

    logger.info(`found streaming activity ${streamingActivity} with url ${streamingActivity.url}`);

    if (streamingActivity.url !== null && presence.guild !== null) {
      const channel = presence.guild.channels.cache.find(
        (chan) => chan.name.includes('stream') || chan.name.includes('twitch')
      );

      if (channel && channel.type === 'text') {
        (channel as TextChannel).send(
          `${presence.user?.username} is streaming!\nCheck it out at ${streamingActivity.url}`
        );

        // set cooldown for this user
        this.messageTimestampCache.set(presence.userID);

        logger.info(
          `Posted streaming activity from user ${presence.user?.username} to guild ${presence.guild} in channel ${channel.name}.`
        );
      }
    }
  }
}
