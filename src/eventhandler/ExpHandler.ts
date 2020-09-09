import {
  Client,
  Message,
  VoiceState,
  Collection,
  MessageReaction,
  User,
  PartialUser,
} from 'discord.js';
import Ranking from '../db/models/Ranking';
import logger from '../logging';
import TimeoutCache from '../TimeoutCache';
import EventHandlerInterface from './EventHandlerInterface';

const MAX_LEVEL = 100;
const MAX_LEVEL_EXP = 100000000;
const FIRST_LEVEL_EXP = 1000;

// experience gained
const MESSAGE_EXP = 10;
const VOICE_PER_M_EXP = 1;
const GIVE_REACTION_EXP = 5;
const RECEIVE_REACTION_EXP = 10;

const B = Math.log(MAX_LEVEL_EXP / FIRST_LEVEL_EXP) / (MAX_LEVEL - 1);
const A = FIRST_LEVEL_EXP / (Math.exp(B) - 1);

function calculateExpForLevel(level: number): number {
  const x = Math.round(A * Math.exp(B * (level - 1)));
  const y = Math.round(A * Math.exp(B * level));

  return y - x - FIRST_LEVEL_EXP;
}

function allLevels() {
  const lvls = [];
  for (let i = 1; i <= MAX_LEVEL; i++) {
    lvls.push(calculateExpForLevel(i));
  }
  return lvls;
}

export const LEVELS = allLevels();

function getLevelForExp(exp: number): number {
  for (let i = 0; i < LEVELS.length; i++) {
    if (LEVELS[i] > exp) {
      return i;
    }
  }
  return MAX_LEVEL;
}

export default class ExpHandler extends EventHandlerInterface {
  messageCooldowns = new TimeoutCache(5);
  reactionCooldowns = new TimeoutCache(10);
  inVoiceChatTimestamps = new Collection<string, number>();

  constructor(client: Client) {
    super(client);
    this.name = 'exp';

    this.client.on('message', (message) => {
      this.onMessage(message);
    });

    this.client.on('voiceStateUpdate', (oldState, newState) => {
      this.onVoiceStateUpdate(oldState, newState);
    });

    this.client.on('messageReactionAdd', (reaction, user) => {
      this.onMessageReactionAdd(reaction, user);
    });
  }

  async onMessage(message: Message) {
    const userId = message.author.id;
    const guildId = message.guild?.id;

    if (!guildId) {
      logger.warn('Cannot get guildId in onMessage');
      return;
    }

    // ignore bots and bot commands
    if (message.author.bot === true || message.content.match(/^[\\.|,|;|!].*/)) {
      return;
    }

    if (!this.messageCooldowns.isExpired(userId)) {
      logger.info(
        `${
          message.author.username
        } exp gain is on cooldown for ${this.messageCooldowns.timeToExpired(userId)} seconds.`
      );

      return;
    }

    this.messageCooldowns.set(userId, message.createdTimestamp);

    await this.giveExp(userId, guildId, MESSAGE_EXP);
  }

  onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const userId = newState.member?.user.id;
    const guildId = newState.guild.id;

    if (!userId) {
      logger.warn('Cannot get userId in onVoiceStateUpdate');
      return;
    }

    // user just switched channels, nothing to do
    if (oldState.channelID && newState.channelID) {
      return;
    }

    // user entered a channel
    if (!oldState.channelID && newState.channelID) {
      this.inVoiceChatTimestamps.set(userId, Date.now());
    }

    // user left a channel
    if (oldState.channelID && !newState.channelID) {
      const enteredTimestamp = this.inVoiceChatTimestamps.get(userId);
      if (!enteredTimestamp) {
        logger.warn(`Cannot get enteredTimestamp for user ${userId}`);
        return;
      }
      this.inVoiceChatTimestamps.delete(userId);

      const minutesinVc = (Date.now() - enteredTimestamp) / (1000 * 60);
      const exp = Math.round(minutesinVc * VOICE_PER_M_EXP);

      if (exp > 0) {
        this.giveExp(userId, guildId, exp);

        logger.info(
          `${newState.member?.user.username} gained ${exp} exp for being in VC for ${minutesinVc} minutes.`
        );
      }
    }
  }

  async onMessageReactionAdd(reaction: MessageReaction, user: User | PartialUser) {
    const message = await reaction.message.fetch();
    const userIdReceived = message.author.id;
    const userIdGiven = user.id;
    const guildId = message.guild?.id;
    const { NODE_ENV } = process.env;

    if (!guildId) {
      logger.warn('Cannot get guildId in onMessageReactionAdd');
      return;
    }

    // ignore reaction given to your own message
    if (userIdGiven === userIdReceived && NODE_ENV !== 'development') {
      return;
    }

    // always give the receiver exp
    await this.giveExp(userIdReceived, guildId, RECEIVE_REACTION_EXP);
    logger.info(
      `Giving ${message.author.username} ${RECEIVE_REACTION_EXP} exp for getting a reaction.`
    );

    // give reaction giver exp on cooldown
    if (this.reactionCooldowns.isExpired(userIdGiven)) {
      await this.giveExp(userIdGiven, guildId, GIVE_REACTION_EXP);
      logger.info(`Giving ${user.username} ${GIVE_REACTION_EXP} exp for giving a reaction.`);
      this.reactionCooldowns.set(userIdGiven);
    }
  }

  async giveExp(userId: string, guildId: string, exp: number) {
    const result = await Ranking.findOne({
      where: { userId, guildId },
    });

    if (!result) {
      await Ranking.create({ userId, guildId });
    } else {
      result.experience += exp;
      result.level = getLevelForExp(result.experience);
      await result.save();
    }
  }
}
