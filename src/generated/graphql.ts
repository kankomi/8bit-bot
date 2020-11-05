export type Maybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Query = {
  __typename?: 'Query'
  hello: Scalars['String']
  config: Config
  guild: Guild
  message: Scalars['String']
  player: PlayerState
  searchSong: Array<Song>
  ranking?: Maybe<Ranking>
  rankings: Array<Ranking>
  statistic: Statistic
}

export type QueryConfigArgs = {
  guildId: Scalars['String']
}

export type QueryGuildArgs = {
  guildId: Scalars['String']
}

export type QueryMessageArgs = {
  messageId: Scalars['String']
  channelId: Scalars['String']
  guildId: Scalars['String']
}

export type QueryPlayerArgs = {
  guildId: Scalars['String']
}

export type QuerySearchSongArgs = {
  limit?: Maybe<Scalars['Int']>
  searchTerm: Scalars['String']
}

export type QueryRankingArgs = {
  userId: Scalars['String']
  guildId: Scalars['String']
}

export type QueryRankingsArgs = {
  guildId: Scalars['String']
}

export type QueryStatisticArgs = {
  type: StatisticType
  userId: Scalars['String']
  guildId: Scalars['String']
}

export type Config = {
  __typename?: 'Config'
  guildId: Scalars['String']
  rankMessageId?: Maybe<Scalars['String']>
}

export type Guild = {
  __typename?: 'Guild'
  id: Scalars['ID']
  name: Scalars['String']
  bannerUrl: Scalars['String']
  iconUrl: Scalars['String']
  channels: Array<Channel>
  roles: Array<Role>
  emojis: Array<Emoji>
}

export type GuildChannelsArgs = {
  type?: Maybe<Scalars['String']>
}

export type GuildEmojisArgs = {
  id?: Maybe<Scalars['String']>
}

export type Channel = {
  __typename?: 'Channel'
  id: Scalars['ID']
  name: Scalars['String']
  type: Scalars['String']
}

export type Role = {
  __typename?: 'Role'
  id: Scalars['ID']
  name: Scalars['String']
}

export type Emoji = {
  __typename?: 'Emoji'
  id: Scalars['ID']
  name: Scalars['String']
  identifier: Scalars['String']
  url?: Maybe<Scalars['String']>
  category: Scalars['String']
}

export type PlayerState = {
  __typename?: 'PlayerState'
  isPlaying: Scalars['Boolean']
  songPlaying?: Maybe<Song>
  songQueue: Array<Song>
}

export type Song = {
  __typename?: 'Song'
  title: Scalars['String']
  cover: Scalars['String']
  url: Scalars['String']
}

export type Ranking = {
  __typename?: 'Ranking'
  id: Scalars['ID']
  guildId: Scalars['String']
  userId: Scalars['String']
  experience: Scalars['Int']
  level: Scalars['Int']
  user?: Maybe<User>
  expToNextLevel: Scalars['Int']
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  username: Scalars['String']
  avatarUrl?: Maybe<Scalars['String']>
}

export type Statistic = {
  __typename?: 'Statistic'
  id: Scalars['ID']
  type: StatisticType
  value: Scalars['Int']
}

export enum StatisticType {
  Message = 'MESSAGE',
  TimeVcInS = 'TIME_VC_IN_S',
  AttachementPosted = 'ATTACHEMENT_POSTED',
  LinkPosted = 'LINK_POSTED',
  Toe = 'TOE',
  Reacted = 'REACTED',
  ReceivedReaction = 'RECEIVED_REACTION',
}

export type Mutation = {
  __typename?: 'Mutation'
  login: UserInfo
  verify: Scalars['Boolean']
  createLoginToken: Scalars['String']
  setConfigValue: Config
  postMessage: Scalars['String']
  reactToMessage: Scalars['String']
  addSong: Array<Song>
  playSong: Song
  nextSong: Song
  togglePlayPause: PlayerState
  reorderSongs: PlayerState
  stop: PlayerState
  removeSong: PlayerState
  giveExp: Scalars['Int']
  updateStatistic: Statistic
}

export type MutationLoginArgs = {
  token: Scalars['String']
}

export type MutationVerifyArgs = {
  token: Scalars['String']
}

export type MutationCreateLoginTokenArgs = {
  userId: Scalars['String']
  guildId: Scalars['String']
}

export type MutationSetConfigValueArgs = {
  value: Scalars['String']
  type: Scalars['String']
  guildId: Scalars['String']
}

export type MutationPostMessageArgs = {
  messageId?: Maybe<Scalars['String']>
  message: Scalars['String']
  channelId: Scalars['String']
  guildId: Scalars['String']
}

export type MutationReactToMessageArgs = {
  emojiIdentifier: Array<Scalars['String']>
  messageId: Scalars['String']
  channelId: Scalars['String']
  guildId: Scalars['String']
}

export type MutationAddSongArgs = {
  url: Scalars['String']
  guildId: Scalars['String']
}

export type MutationPlaySongArgs = {
  url: Scalars['String']
  guildId: Scalars['String']
}

export type MutationNextSongArgs = {
  guildId: Scalars['String']
}

export type MutationTogglePlayPauseArgs = {
  guildId: Scalars['String']
}

export type MutationReorderSongsArgs = {
  songQueue: Array<SongInput>
  guildId: Scalars['String']
}

export type MutationStopArgs = {
  guildId: Scalars['String']
}

export type MutationRemoveSongArgs = {
  url: Scalars['String']
  guildId: Scalars['String']
}

export type MutationGiveExpArgs = {
  timeInVCinS?: Maybe<Scalars['Int']>
  type: ExperienceType
  userId: Scalars['String']
  guildId: Scalars['String']
}

export type MutationUpdateStatisticArgs = {
  value: Scalars['Int']
  type: StatisticType
  userId: Scalars['String']
  guildId: Scalars['String']
}

export type UserInfo = {
  __typename?: 'UserInfo'
  userId: Scalars['String']
  guildId: Scalars['String']
  guildName: Scalars['String']
  username: Scalars['String']
}

export type SongInput = {
  title: Scalars['String']
  cover: Scalars['String']
  url: Scalars['String']
}

export enum ExperienceType {
  GiveReaction = 'GIVE_REACTION',
  ReceiveReaction = 'RECEIVE_REACTION',
  Voice = 'VOICE',
  Message = 'MESSAGE',
}

export type Subscription = {
  __typename?: 'Subscription'
  playerStateChanged: PlayerState
  playerStateUpdated: PlayerStateUpdatePayload
}

export type SubscriptionPlayerStateChangedArgs = {
  guildId: Scalars['String']
}

export type SubscriptionPlayerStateUpdatedArgs = {
  guildId: Scalars['String']
}

export type PlayerStateUpdatePayload = {
  __typename?: 'PlayerStateUpdatePayload'
  action: PlayerControlAction
  song?: Maybe<Song>
}

export enum PlayerControlAction {
  Resume = 'RESUME',
  Pause = 'PAUSE',
  Stop = 'STOP',
  Play = 'PLAY',
}

export type GetConfigQueryVariables = Exact<{
  guildId: Scalars['String']
}>

export type GetConfigQuery = { __typename?: 'Query' } & {
  config: { __typename?: 'Config' } & Pick<Config, 'guildId' | 'rankMessageId'>
}

export type GiveExperienceMutationVariables = Exact<{
  guildId: Scalars['String']
  userId: Scalars['String']
  type: ExperienceType
  timeInVCinS?: Maybe<Scalars['Int']>
}>

export type GiveExperienceMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'giveExp'>

export type GetRankingQueryVariables = Exact<{
  guildId: Scalars['String']
  userId: Scalars['String']
}>

export type GetRankingQuery = { __typename?: 'Query' } & {
  ranking?: Maybe<
    { __typename?: 'Ranking' } & Pick<Ranking, 'experience' | 'level' | 'expToNextLevel'>
  >
}

export type GetRankingsQueryVariables = Exact<{
  guildId: Scalars['String']
}>

export type GetRankingsQuery = { __typename?: 'Query' } & {
  rankings: Array<
    { __typename?: 'Ranking' } & Pick<Ranking, 'experience' | 'level' | 'expToNextLevel'> & {
        user?: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'username'>>
      }
  >
}

export type SearchSongQueryVariables = Exact<{
  searchTerm: Scalars['String']
  limit: Scalars['Int']
}>

export type SearchSongQuery = { __typename?: 'Query' } & {
  searchSong: Array<{ __typename?: 'Song' } & Pick<Song, 'title' | 'url' | 'cover'>>
}

export type GetPlayerStateQueryVariables = Exact<{
  guildId: Scalars['String']
}>

export type GetPlayerStateQuery = { __typename?: 'Query' } & {
  player: { __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'> & {
      songQueue: Array<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
      songPlaying?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
    }
}

export type SubscribeToPlayerControlStateSubscriptionVariables = Exact<{
  guildId: Scalars['String']
}>

export type SubscribeToPlayerControlStateSubscription = { __typename?: 'Subscription' } & {
  playerStateUpdated: { __typename?: 'PlayerStateUpdatePayload' } & Pick<
    PlayerStateUpdatePayload,
    'action'
  > & { song?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>> }
}

export type SubscribeToPlayerStateSubscriptionVariables = Exact<{
  guildId: Scalars['String']
}>

export type SubscribeToPlayerStateSubscription = { __typename?: 'Subscription' } & {
  playerStateChanged: { __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'> & {
      songQueue: Array<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
      songPlaying?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
    }
}

export type AddSongMutationVariables = Exact<{
  guildId: Scalars['String']
  url: Scalars['String']
}>

export type AddSongMutation = { __typename?: 'Mutation' } & {
  addSong: Array<{ __typename?: 'Song' } & Pick<Song, 'url' | 'cover' | 'title'>>
}

export type RemoveSongMutationVariables = Exact<{
  guildId: Scalars['String']
  url: Scalars['String']
}>

export type RemoveSongMutation = { __typename?: 'Mutation' } & {
  removeSong: { __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'>
}

export type PlaySongMutationVariables = Exact<{
  guildId: Scalars['String']
  url: Scalars['String']
}>

export type PlaySongMutation = { __typename?: 'Mutation' } & {
  playSong: { __typename?: 'Song' } & Pick<Song, 'title'>
}

export type ReorderSongsMutationVariables = Exact<{
  guildId: Scalars['String']
  songs: Array<SongInput>
}>

export type ReorderSongsMutation = { __typename?: 'Mutation' } & {
  reorderSongs: { __typename?: 'PlayerState' } & {
    songQueue: Array<{ __typename?: 'Song' } & Pick<Song, 'title'>>
  }
}

export type TogglePlayPauseMutationVariables = Exact<{
  guildId: Scalars['String']
}>

export type TogglePlayPauseMutation = { __typename?: 'Mutation' } & {
  togglePlayPause: { __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'>
}

export type StopSongMutationVariables = Exact<{
  guildId: Scalars['String']
}>

export type StopSongMutation = { __typename?: 'Mutation' } & {
  stop: { __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'>
}

export type NextSongMutationVariables = Exact<{
  guildId: Scalars['String']
}>

export type NextSongMutation = { __typename?: 'Mutation' } & {
  nextSong: { __typename?: 'Song' } & Pick<Song, 'title'>
}

export type UpdateStatisticMutationVariables = Exact<{
  guildId: Scalars['String']
  userId: Scalars['String']
  type: StatisticType
  value: Scalars['Int']
}>

export type UpdateStatisticMutation = { __typename?: 'Mutation' } & {
  updateStatistic: { __typename?: 'Statistic' } & Pick<Statistic, 'value'>
}

export type GetStatisticQueryVariables = Exact<{
  guildId: Scalars['String']
  userId: Scalars['String']
  type: StatisticType
}>

export type GetStatisticQuery = { __typename?: 'Query' } & {
  statistic: { __typename?: 'Statistic' } & Pick<Statistic, 'value'>
}
