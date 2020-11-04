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
  _?: Maybe<Scalars['Boolean']>
  ranking?: Maybe<Ranking>
  rankings: Array<Ranking>
  player?: Maybe<PlayerState>
  searchSong?: Maybe<Array<Maybe<Song>>>
  guild?: Maybe<Guild>
  message?: Maybe<Scalars['String']>
  statistic: Statistics
  config: Config
}

export type QueryRankingArgs = {
  guildId: Scalars['String']
  userId: Scalars['String']
}

export type QueryRankingsArgs = {
  guildId: Scalars['String']
}

export type QueryPlayerArgs = {
  guildId: Scalars['String']
}

export type QuerySearchSongArgs = {
  searchTerm: Scalars['String']
  limit?: Maybe<Scalars['Int']>
}

export type QueryGuildArgs = {
  guildId: Scalars['String']
}

export type QueryMessageArgs = {
  guildId: Scalars['String']
  channelId: Scalars['String']
  messageId: Scalars['String']
}

export type QueryStatisticArgs = {
  guildId: Scalars['String']
  userId: Scalars['String']
  type: StatisticType
}

export type QueryConfigArgs = {
  guildId: Scalars['String']
}

export type Ranking = {
  __typename?: 'Ranking'
  id: Scalars['ID']
  guildId: Scalars['String']
  userId: Scalars['String']
  experience: Scalars['Float']
  level: Scalars['Float']
  user?: Maybe<User>
  expToNextLevel?: Maybe<Scalars['Int']>
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  username: Scalars['String']
  avatarUrl?: Maybe<Scalars['String']>
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

export type Guild = {
  __typename?: 'Guild'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  bannerUrl?: Maybe<Scalars['String']>
  iconUrl?: Maybe<Scalars['String']>
  emojis: Array<Emoji>
  channels: Array<Channel>
  roles: Array<Role>
}

export type GuildEmojisArgs = {
  id?: Maybe<Scalars['String']>
}

export type GuildChannelsArgs = {
  type?: Maybe<Scalars['String']>
}

export type Emoji = {
  __typename?: 'Emoji'
  id: Scalars['ID']
  name: Scalars['String']
  identifier: Scalars['String']
  url?: Maybe<Scalars['String']>
  category: Scalars['String']
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

export enum StatisticType {
  Message = 'MESSAGE',
  TimeVcInS = 'TIME_VC_IN_S',
  AttachementPosted = 'ATTACHEMENT_POSTED',
  LinkPosted = 'LINK_POSTED',
  Toe = 'TOE',
  Reacted = 'REACTED',
  ReceivedReaction = 'RECEIVED_REACTION',
}

export type Statistics = {
  __typename?: 'Statistics'
  id: Scalars['ID']
  userId: Scalars['String']
  guildId: Scalars['String']
  value: Scalars['Int']
  type: StatisticType
}

export type Config = {
  __typename?: 'Config'
  guildId: Scalars['String']
  rankMessageId?: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  _?: Maybe<Scalars['Boolean']>
  giveExp: Scalars['Int']
  addSong: Array<Song>
  playSong?: Maybe<Song>
  nextSong?: Maybe<Song>
  togglePlayPause?: Maybe<PlayerState>
  removeSong?: Maybe<Scalars['Boolean']>
  reorderSongs?: Maybe<PlayerState>
  stop?: Maybe<PlayerState>
  postMessage?: Maybe<Scalars['String']>
  reactToMessage?: Maybe<Scalars['String']>
  updateStatistic: Statistics
  setConfigValue: Config
}

export type MutationGiveExpArgs = {
  guildId: Scalars['String']
  userId: Scalars['String']
  type: ExperienceType
  timeInVCinS?: Maybe<Scalars['Int']>
}

export type MutationAddSongArgs = {
  guildId: Scalars['String']
  url: Scalars['String']
}

export type MutationPlaySongArgs = {
  guildId: Scalars['String']
  url: Scalars['String']
}

export type MutationNextSongArgs = {
  guildId: Scalars['String']
}

export type MutationTogglePlayPauseArgs = {
  guildId: Scalars['String']
}

export type MutationRemoveSongArgs = {
  guildId: Scalars['String']
  url: Scalars['String']
}

export type MutationReorderSongsArgs = {
  guildId: Scalars['String']
  songQueue: Array<SongInput>
}

export type MutationStopArgs = {
  guildId: Scalars['String']
}

export type MutationPostMessageArgs = {
  guildId: Scalars['String']
  channelId: Scalars['String']
  messageId?: Maybe<Scalars['String']>
  message: Scalars['String']
}

export type MutationReactToMessageArgs = {
  guildId: Scalars['String']
  channelId: Scalars['String']
  messageId: Scalars['String']
  emojiIdentifier: Array<Scalars['String']>
}

export type MutationUpdateStatisticArgs = {
  guildId: Scalars['String']
  userId: Scalars['String']
  type: StatisticType
  value: Scalars['Int']
}

export type MutationSetConfigValueArgs = {
  guildId: Scalars['String']
  type: ConfigType
  value: Scalars['String']
}

export enum ExperienceType {
  GiveReaction = 'GIVE_REACTION',
  ReceiveReaction = 'RECEIVE_REACTION',
  Voice = 'VOICE',
  Message = 'MESSAGE',
}

export type SongInput = {
  title: Scalars['String']
  cover: Scalars['String']
  url: Scalars['String']
}

export enum ConfigType {
  RankMessageId = 'RANK_MESSAGE_ID',
}

export type Subscription = {
  __typename?: 'Subscription'
  _?: Maybe<Scalars['Boolean']>
  playerStateChanged?: Maybe<PlayerState>
  playerStateUpdated?: Maybe<PlayerControl>
}

export type SubscriptionPlayerStateChangedArgs = {
  guildId: Scalars['String']
}

export type SubscriptionPlayerStateUpdatedArgs = {
  guildId: Scalars['String']
}

export type PlayerControl = {
  __typename?: 'PlayerControl'
  song?: Maybe<Song>
  action: PlayerControlAction
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
  searchSong?: Maybe<Array<Maybe<{ __typename?: 'Song' } & Pick<Song, 'title' | 'url' | 'cover'>>>>
}

export type GetPlayerStateQueryVariables = Exact<{
  guildId: Scalars['String']
}>

export type GetPlayerStateQuery = { __typename?: 'Query' } & {
  player?: Maybe<
    { __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'> & {
        songQueue: Array<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
        songPlaying?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
      }
  >
}

export type SubscribeToPlayerControlStateSubscriptionVariables = Exact<{
  guildId: Scalars['String']
}>

export type SubscribeToPlayerControlStateSubscription = { __typename?: 'Subscription' } & {
  playerStateUpdated?: Maybe<
    { __typename?: 'PlayerControl' } & Pick<PlayerControl, 'action'> & {
        song?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
      }
  >
}

export type SubscribeToPlayerStateSubscriptionVariables = Exact<{
  guildId: Scalars['String']
}>

export type SubscribeToPlayerStateSubscription = { __typename?: 'Subscription' } & {
  playerStateChanged?: Maybe<
    { __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'> & {
        songQueue: Array<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
        songPlaying?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title' | 'cover' | 'url'>>
      }
  >
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

export type RemoveSongMutation = { __typename?: 'Mutation' } & Pick<Mutation, 'removeSong'>

export type PlaySongMutationVariables = Exact<{
  guildId: Scalars['String']
  url: Scalars['String']
}>

export type PlaySongMutation = { __typename?: 'Mutation' } & {
  playSong?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title'>>
}

export type ReorderSongsMutationVariables = Exact<{
  guildId: Scalars['String']
  songs: Array<SongInput>
}>

export type ReorderSongsMutation = { __typename?: 'Mutation' } & {
  reorderSongs?: Maybe<
    { __typename?: 'PlayerState' } & {
      songQueue: Array<{ __typename?: 'Song' } & Pick<Song, 'title'>>
    }
  >
}

export type TogglePlayPauseMutationVariables = Exact<{
  guildId: Scalars['String']
}>

export type TogglePlayPauseMutation = { __typename?: 'Mutation' } & {
  togglePlayPause?: Maybe<{ __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'>>
}

export type StopSongMutationVariables = Exact<{
  guildId: Scalars['String']
}>

export type StopSongMutation = { __typename?: 'Mutation' } & {
  stop?: Maybe<{ __typename?: 'PlayerState' } & Pick<PlayerState, 'isPlaying'>>
}

export type NextSongMutationVariables = Exact<{
  guildId: Scalars['String']
}>

export type NextSongMutation = { __typename?: 'Mutation' } & {
  nextSong?: Maybe<{ __typename?: 'Song' } & Pick<Song, 'title'>>
}

export type UpdateStatisticMutationVariables = Exact<{
  guildId: Scalars['String']
  userId: Scalars['String']
  type: StatisticType
  value: Scalars['Int']
}>

export type UpdateStatisticMutation = { __typename?: 'Mutation' } & {
  updateStatistic: { __typename?: 'Statistics' } & Pick<Statistics, 'value'>
}

export type GetStatisticQueryVariables = Exact<{
  guildId: Scalars['String']
  userId: Scalars['String']
  type: StatisticType
}>

export type GetStatisticQuery = { __typename?: 'Query' } & {
  statistic: { __typename?: 'Statistics' } & Pick<Statistics, 'value'>
}
