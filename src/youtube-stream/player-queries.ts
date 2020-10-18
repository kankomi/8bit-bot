import { gql } from '@apollo/client'

export const GET_PLAYER_STATE = gql`
  query($guildId: String!) {
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

export const SUBSCRIBE_PLAYER_STATE = gql`
  subscription($guildId: String!) {
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
  mutation($guildId: String!, $url: String!) {
    addSong(guildId: $guildId, url: $url) {
      title
    }
  }
`

export const REMOVE_SONG_MUTATION = gql`
  mutation($guildId: String!, $url: String!) {
    removeSong(guildId: $guildId, url: $url)
  }
`

export const PLAY_SONG_MUTATION = gql`
  mutation($guildId: String!, $url: String!) {
    playSong(guildId: $guildId, url: $url) {
      title
    }
  }
`

export const REORDER_SONG_MUTATION = gql`
  mutation($guildId: String!, $songs: [SongInput]!) {
    reorderSongs(guildId: $guildId, songQueue: $songs) {
      songQueue {
        title
      }
    }
  }
`

export const TOGGLE_PLAY_PAUSE_MUTATION = gql`
  mutation($guildId: String!) {
    togglePlayPause(guildId: $guildId) {
      isPlaying
    }
  }
`

export const STOP_MUTATION = gql`
  mutation($guildId: String!) {
    stop(guildId: $guildId) {
      isPlaying
    }
  }
`
export const NEXT_SONG_MUTATION = gql`
  mutation($guildId: String!) {
    nextSong(guildId: $guildId) {
      title
    }
  }
`
