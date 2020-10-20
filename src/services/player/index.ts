import apolloClient from '../../apollo-client'
import { QuerySearchSongArgs, SearchSongQuery, Song } from '../../generated/graphql'
import logger from '../../utils/logging'
import { SEARCH_SONG_QUERY } from './queries'

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
