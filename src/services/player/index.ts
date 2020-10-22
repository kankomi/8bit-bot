import apolloClient from '../../apollo-client'
import {
  AddSongMutation,
  AddSongMutationVariables,
  GetPlayerStateQuery,
  GetPlayerStateQueryVariables,
  Maybe,
  NextSongMutation,
  NextSongMutationVariables,
  PlayerState,
  QuerySearchSongArgs,
  SearchSongQuery,
  Song,
  StopSongMutation,
  StopSongMutationVariables,
  SubscribeToPlayerStateSubscription,
  SubscribeToPlayerStateSubscriptionVariables,
  TogglePlayPauseMutation,
  TogglePlayPauseMutationVariables,
  SubscribeToPlayerControlStateSubscription,
  SubscribeToPlayerControlStateSubscriptionVariables,
} from '../../generated/graphql'
import { formatGraphQlErrors } from '../../utils'
import logger from '../../utils/logging'
import {
  ADD_SONG_MUTATION,
  GET_PLAYER_STATE,
  NEXT_SONG_MUTATION,
  SEARCH_SONG_QUERY,
  STOP_MUTATION,
  SUBSCRIBE_PLAYER_STATE,
  SUBSCRIBE_PLAYER_CONTROL_STATE,
  TOGGLE_PLAY_PAUSE_MUTATION,
} from './queries'

export async function searchSong(
  searchTerm: string,
  limit: number = 5
): Promise<Song[] | undefined> {
  const { data, error } = await apolloClient.query<SearchSongQuery, QuerySearchSongArgs>({
    query: SEARCH_SONG_QUERY,
    variables: { searchTerm, limit },
  })

  if (error !== undefined) {
    logger.error(error)
    return undefined
  }
  if (data.searchSong !== null && data.searchSong !== undefined) {
    return data.searchSong as Song[]
  }

  return undefined
}

export async function getPlayerState(guildId: string): Promise<Maybe<PlayerState>> {
  const { data, errors } = await apolloClient.query<
    GetPlayerStateQuery,
    GetPlayerStateQueryVariables
  >({ query: GET_PLAYER_STATE, variables: { guildId } })

  if (errors) {
    logger.error(`Error while getting player state: ${formatGraphQlErrors(errors)}`)
  }

  if (!data || !data.player) {
    return undefined
  }

  return data.player
}

export async function stopSong(guildId: string): Promise<void> {
  const { errors } = await apolloClient.mutate<StopSongMutation, StopSongMutationVariables>({
    mutation: STOP_MUTATION,
    variables: { guildId },
  })

  if (errors) {
    logger.error(`Error while stopping song: ${formatGraphQlErrors(errors)}`)
  }
}

export async function togglePlayPause(guildId: string): Promise<void> {
  const { errors } = await apolloClient.mutate<
    TogglePlayPauseMutation,
    TogglePlayPauseMutationVariables
  >({
    mutation: TOGGLE_PLAY_PAUSE_MUTATION,
    variables: { guildId },
  })

  if (errors) {
    logger.error(`Error while toggling play pause: ${formatGraphQlErrors(errors)}`)
  }
}

export async function nextSong(guildId: string): Promise<void> {
  const { errors } = await apolloClient.mutate<NextSongMutation, NextSongMutationVariables>({
    mutation: NEXT_SONG_MUTATION,
    variables: { guildId },
  })

  if (errors) {
    logger.error(`Error while toggling play pause: ${formatGraphQlErrors(errors)}`)
  }
}

export async function addSong(guildId: string, url: string): Promise<Song[]> {
  const { data, errors } = await apolloClient.mutate<AddSongMutation, AddSongMutationVariables>({
    mutation: ADD_SONG_MUTATION,
    variables: { guildId, url },
  })

  if (errors) {
    logger.error(`Error while adding song: ${formatGraphQlErrors(errors)}`)
  }
  if (data?.addSong) {
    return data.addSong
  }

  return []
}
/**
 * @deprecated
 * @param guildId guildId
 */
export function subscribeToPlayerState(guildId: string) {
  const state$ = apolloClient.subscribe<
    SubscribeToPlayerStateSubscription,
    SubscribeToPlayerStateSubscriptionVariables
  >({
    query: SUBSCRIBE_PLAYER_STATE,
    variables: { guildId },
  })

  return state$
}

export function subscribeToPlayerControlState(guildId: string) {
  const state$ = apolloClient.subscribe<
    SubscribeToPlayerControlStateSubscription,
    SubscribeToPlayerControlStateSubscriptionVariables
  >({
    query: SUBSCRIBE_PLAYER_CONTROL_STATE,
    variables: { guildId },
  })

  return state$
}
