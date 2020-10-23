import apolloClient from '../../apollo-client'
import {
  ExperienceType,
  GiveExperienceMutation,
  GiveExperienceMutationVariables,
  QueryRankingArgs,
  GetRankingQuery,
  QueryRankingsArgs,
  GetRankingsQuery,
} from '../../generated/graphql'
import { formatGraphQlErrors } from '../../utils'
import logger from '../../utils/logging'
import { GET_RANKING, GET_RANKINGS, GIVE_EXPERIENCE } from './queries'

export async function giveExperience(
  guildId: string,
  userId: string,
  type: ExperienceType,
  timeInVCinS?: number
): Promise<number> {
  try {
    let time = timeInVCinS

    if (time) {
      time = Math.round(time)
    }

    const { data, errors } = await apolloClient.mutate<
      GiveExperienceMutation,
      GiveExperienceMutationVariables
    >({
      mutation: GIVE_EXPERIENCE,
      variables: { guildId, userId, type, timeInVCinS: time },
    })

    if (errors) {
      logger.error(`Error in giveExp: ${formatGraphQlErrors(errors)}`)
      return -1
    }

    return data?.giveExp !== undefined ? data.giveExp : -1
  } catch (error) {
    logger.error(`errro in giveExperience occurred ${JSON.stringify(error, null, 2)}`)
  }

  return -1
}

export async function getRanking(guildId: string, userId: string) {
  try {
    const { data } = await apolloClient.query<GetRankingQuery, QueryRankingArgs>({
      query: GET_RANKING,
      variables: { guildId, userId },
    })

    return data.ranking
  } catch (error) {
    logger.error(`an error in getRanking occured: ${JSON.stringify(error, null, 2)}`)
  }

  return undefined
}

export async function getRankings(guildId: string) {
  try {
    const { data } = await apolloClient.query<GetRankingsQuery, QueryRankingsArgs>({
      query: GET_RANKINGS,
      variables: { guildId },
    })

    return data.rankings
  } catch (error) {
    logger.error(`an error in getRanking occured: ${JSON.stringify(error, null, 2)}`)
  }

  return undefined
}
