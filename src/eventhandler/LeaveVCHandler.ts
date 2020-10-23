import { Client, Message, VoiceState } from 'discord.js'
import EventHandlerInterface from './EventHandlerInterface'
import logger from '../utils/logging'
import * as player from '../services/player'

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
    const voiceConnection = oldState.guild.voice?.connection
    if (!voiceConnection) {
      return
    }

    if (newState.channel?.members.array() === undefined) {
      logger.info('No one in voice channel, leaving...')
      player.stopPlayer(newState.guild.id)
      voiceConnection.disconnect()
    }
  }
}
