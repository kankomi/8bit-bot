import { Client, User } from 'discord.js';

// eslint-disable-next-line import/prefer-default-export
export function getUserFromMention(
  client: Client,
  mention: string
): User | undefined {
  if (!mention) return undefined;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    let m = mention.slice(2, -1);

    if (m.startsWith('!')) {
      m = m.slice(1);
    }

    return client.users.cache.get(m);
  }

  return undefined;
}
