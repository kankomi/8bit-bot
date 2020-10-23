import { gql } from '@apollo/client'

export const INC_TOES_QUERY = gql`
  mutation incToes($guildId: String!, $userId: String!) {
    updateStatistic(guildId: $guildId, userId: $userId, type: TOE, value: 1) {
      value
    }
  }
`
