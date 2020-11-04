import { gql } from '@apollo/client'

export const GET_CONFIG = gql`
  query getConfig($guildId: String!) {
    config(guildId: $guildId) {
      guildId
      rankMessageId
    }
  }
`
