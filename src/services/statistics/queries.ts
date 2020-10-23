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

export const GET_STATISTIC = gql`
  query getStatistic($guildId: String!, $userId: String!, $type: StatisticType!) {
    statistic(guildId: $guildId, userId: $userId, type: $type) {
      value
    }
  }
`
