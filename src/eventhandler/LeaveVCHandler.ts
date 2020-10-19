import { Client, Message, VoiceState } from 'discord.js'
import EventHandlerInterface from './EventHandlerInterface'
import logger from '../utils/logging'
import StreamHandler from '../youtube-stream/StreamHandler'

export default class LeaveVCHandler extends EventHandlerInterface {
  constructor(client: Client) {
    super(client, 'leaveVC')
    client.on('voiceStateUpdate', (oldState, newState) => this.onVSupdate(oldState, newState))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onMessage(message: Message) {
    // not implemented
  }

  async onVSupdate(oldState: VoiceState, newState: VoiceState) {
    if (newState.channel?.members.array() === undefined) {
      StreamHandler.stop(newState.guild.id)
      const queue = StreamHandler.getServerQueue(newState.guild.id)
      if (queue) {
        logger.info('No one in voice channel, leaving...')
        queue.songs = []
        queue.dispatcher?.end()
        queue.connection.disconnect()
      }
    }
  }
}
