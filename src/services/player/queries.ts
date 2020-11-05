/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

export const SEARCH_SONG_QUERY = gql`
  query searchSong($searchTerm: String!, $limit: Int!) {
    searchSong(searchTerm: $searchTerm, limit: $limit) {
      title
      url
      cover
    }
  }
`
export const GET_PLAYER_STATE = gql`
  query getPlayerState($guildId: String!) {
    player(guildId: $guildId) {
      isPlaying
      songQueue {
        title
        cover
        url
      }
      songPlaying {
        title
        cover
        url
      }
    }
  }
`

export const SUBSCRIBE_PLAYER_CONTROL_STATE = gql`
  subscription subscribeToPlayerControlState($guildId: String!) {
    playerStateUpdated(guildId: $guildId) {
      action
      song {
        title
        cover
        url
      }
    }
  }
`
export const SUBSCRIBE_PLAYER_STATE = gql`
  subscription subscribeToPlayerState($guildId: String!) {
    playerStateChanged(guildId: $guildId) {
      isPlaying
      songQueue {
        title
        cover
        url
      }
      songPlaying {
        title
        cover
        url
      }
    }
  }
`

export const ADD_SONG_MUTATION = gql`
  mutation addSong($guildId: String!, $url: String!) {
    addSong(guildId: $guildId, url: $url) {
      url
      cover
      title
    }
  }
`

export const REMOVE_SONG_MUTATION = gql`
  mutation removeSong($guildId: String!, $url: String!) {
    removeSong(guildId: $guildId, url: $url) {
      isPlaying
    }
  }
`

export const PLAY_SONG_MUTATION = gql`
  mutation playSong($guildId: String!, $url: String!) {
    playSong(guildId: $guildId, url: $url) {
      title
    }
  }
`

export const REORDER_SONG_MUTATION = gql`
  mutation reorderSongs($guildId: String!, $songs: [SongInput!]!) {
    reorderSongs(guildId: $guildId, songQueue: $songs) {
      songQueue {
        title
      }
    }
  }
`

export const TOGGLE_PLAY_PAUSE_MUTATION = gql`
  mutation togglePlayPause($guildId: String!) {
    togglePlayPause(guildId: $guildId) {
      isPlaying
    }
  }
`

export const STOP_MUTATION = gql`
  mutation stopSong($guildId: String!) {
    stop(guildId: $guildId) {
      isPlaying
    }
  }
`
export const NEXT_SONG_MUTATION = gql`
  mutation nextSong($guildId: String!) {
    nextSong(guildId: $guildId) {
      title
    }
  }
`
