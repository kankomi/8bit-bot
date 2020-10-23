import { gql } from '@apollo/client'

export const UPDATE_STATISTIC = gql`
  mutation updateStatistic(
    $guildId: String!
    $userId: String!
    $type: StatisticType!
    $value: Int!
  ) {
    updateStatistic(guildId: $guildId, userId: $userId, type: $type, value: $value) {
      value
    }
  }
`
