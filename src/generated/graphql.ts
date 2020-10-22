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
  player?: Maybe<PlayerState>
  searchSong?: Maybe<Array<Maybe<Song>>>
  guild?: Maybe<Guild>
  statistics?: Maybe<Statistics>
}

export type QueryRankingArgs = {
  guildId: Scalars['String']
  userId: Scalars['String']
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

export type QueryStatisticsArgs = {
  guildId: Scalars['String']
  userId: Scalars['String']
  type?: Maybe<StatisticType>
}

export type Ranking = {
  __typename?: 'Ranking'
  id: Scalars['ID']
  guildId: Scalars['String']
  userId: Scalars['String']
  experience?: Maybe<Scalars['Float']>
  level?: Maybe<Scalars['Float']>
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
  emojis?: Maybe<Array<Maybe<Emoji>>>
  channels?: Maybe<Array<Maybe<Channel>>>
  roles?: Maybe<Array<Maybe<Role>>>
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
  name?: Maybe<Scalars['String']>
  identifier?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

export type Channel = {
  __typename?: 'Channel'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type Role = {
  __typename?: 'Role'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
}

export enum StatisticType {
  Message = 'MESSAGE',
  TimeInVcS = 'TIME_IN_VC_S',
  PicturePosted = 'PICTURE_POSTED',
  LinkPosted = 'LINK_POSTED',
  Toe = 'TOE',
}

export type Statistics = {
  __typename?: 'Statistics'
  id: Scalars['ID']
  userId: Scalars['String']
  guildId: Scalars['String']
  value: Scalars['Int']
  type: StatisticType
}

export type Mutation = {
  __typename?: 'Mutation'
  _?: Maybe<Scalars['Boolean']>
  addSong: Array<Song>
  playSong?: Maybe<Song>
  nextSong?: Maybe<Song>
  togglePlayPause?: Maybe<PlayerState>
  removeSong?: Maybe<Scalars['Boolean']>
  reorderSongs?: Maybe<PlayerState>
  stop?: Maybe<PlayerState>
  postMessage?: Maybe<Scalars['String']>
  updateStatistic: Statistics
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
  message: Scalars['String']
  reactEmojiIds?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type MutationUpdateStatisticArgs = {
  guildId: Scalars['String']
  userId: Scalars['String']
  type: StatisticType
  value: Scalars['Int']
}

export type SongInput = {
  title: Scalars['String']
  cover: Scalars['String']
  url: Scalars['String']
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

export type IncToesMutationVariables = Exact<{
  guildId: Scalars['String']
  userId: Scalars['String']
}>

export type IncToesMutation = { __typename?: 'Mutation' } & {
  updateStatistic: { __typename?: 'Statistics' } & Pick<Statistics, 'value'>
}
