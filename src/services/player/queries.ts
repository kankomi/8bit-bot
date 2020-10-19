/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

export const SEARCH_SONG_QUERY = gql`
  query($searchTerm: String!, $limit: Int!) {
    searchSong(searchTerm: $searchTerm, limit: $limit) {
      title
      url
      cover
    }
  }
`
