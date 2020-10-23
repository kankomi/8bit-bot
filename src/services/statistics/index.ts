import apolloClient from '../../apollo-client'
import {
  MutationUpdateStatisticArgs,
  StatisticType,
  UpdateStatisticMutation,
} from '../../generated/graphql'
import { formatGraphQlErrors } from '../../utils'
import logger from '../../utils/logging'
import { UPDATE_STATISTIC } from './queries'

export async function updateStatistic(
  guildId: string,
  userId: string,
  type: StatisticType,
  value: number
) {
  try {
    const { data, errors } = await apolloClient.mutate<
      UpdateStatisticMutation,
      MutationUpdateStatisticArgs
    >({
      mutation: UPDATE_STATISTIC,
      variables: { guildId, userId, type, value: Math.floor(value) },
    })

    if (errors) {
      logger.error(formatGraphQlErrors(errors))
      return undefined
    }

    return data?.updateStatistic.value
  } catch (error) {
    logger.error(`error occured while executing updateStatistic: ${JSON.stringify(error, null, 2)}`)
  }
  return undefined
}
