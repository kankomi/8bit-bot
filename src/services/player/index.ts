import apolloClient from '../../apollo-client'
import { Song } from '../../types'
import logger from '../../utils/logging'
import { SEARCH_SONG_QUERY } from './queries'

// eslint-disable-next-line import/prefer-default-export
export async function searchSong(
  searchTerm: string,
  limit: number = 5
): Promise<Song[] | undefined> {
  const result = await apolloClient.query<{ searchSong: Song[] }>({
    query: SEARCH_SONG_QUERY,
    variables: { searchTerm, limit },
  })

  if (result.error !== undefined) {
    logger.error(result.error)
    return undefined
  }

  return result.data.searchSong
}
