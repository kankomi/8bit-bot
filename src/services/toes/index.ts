import apolloClient from '../../apollo-client'
import { INC_TOES_QUERY } from './queries'
import { IncToesMutation, IncToesMutationVariables } from '../../generated/graphql'
import logger from '../../utils/logging'

export async function incToeCount(guildId: string, userId: string): Promise<number | undefined> {
  const { data, errors } = await apolloClient.mutate<IncToesMutation, IncToesMutationVariables>({
    mutation: INC_TOES_QUERY,
    variables: { guildId, userId },
  })

  if (!data || !data.updateStatistic) {
    logger.warn('inc toes returned undefined')
    return undefined
  }

  if (errors) {
    logger.error(
      `Errors while increasing toe count occured: ${errors.map((e) => `'${e.message}'`).join(', ')}`
    )
    return undefined
  }

  return data.updateStatistic.value
}
