import { gql } from '@apollo/client'

export const GIVE_EXPERIENCE = gql`
  mutation giveExperience(
    $guildId: String!
    $userId: String!
    $type: ExperienceType!
    $timeInVCinS: Int
  ) {
    giveExp(guildId: $guildId, userId: $userId, type: $type, timeInVCinS: $timeInVCinS)
  }
`

export const GET_RANKING = gql`
  query getRanking($guildId: String!, $userId: String!) {
    ranking(guildId: $guildId, userId: $userId) {
      experience
      level
      expToNextLevel
    }
  }
`
