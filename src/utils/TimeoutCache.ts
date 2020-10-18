// eslint-disable-next-line max-classes-per-file
import { Collection } from 'discord.js'

export default class TimeoutCache {
  private cache = new Collection<string, number>()
  private expiration: number

  constructor(expiration: number = 10) {
    this.expiration = expiration
  }

  set(key: string, timestamp?: number): void {
    this.cache.set(key, timestamp || Date.now())
    setTimeout(() => this.cache.delete(key), this.expiration * 1000)
  }

  /**
   * Returns true if the value is expired.
   * @param key the key
   */
  isExpired(key: string): boolean {
    const now = Date.now()
    const timestamp = this.cache.get(key)

    if (timestamp) {
      const expirationTime = timestamp + this.expiration * 1000

      if (now < expirationTime) {
        return false
      }
    }

    return true
  }

  timeToExpired(key: string): number | undefined {
    const now = Date.now()
    const timestamp = this.cache.get(key)

    if (!timestamp) {
      return undefined
    }

    const expirationTime = timestamp + this.expiration * 1000

    return (expirationTime - now) / 1000
  }
}
