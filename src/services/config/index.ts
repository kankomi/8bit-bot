import apolloClient from '../../apollo-client'
import { GetConfigQuery, QueryConfigArgs } from '../../generated/graphql'
import { formatGraphQlErrors } from '../../utils'
import logger from '../../utils/logging'
import { GET_CONFIG } from './queries'

export async function getConfig(guildId: string) {
  try {
    const { data, errors } = await apolloClient.mutate<GetConfigQuery, QueryConfigArgs>({
      mutation: GET_CONFIG,
      variables: { guildId },
    })

    if (errors) {
      logger.error(formatGraphQlErrors(errors))
      return undefined
    }

    return data?.config
  } catch (error) {
    logger.error(`error occured while executing updateStatistic: ${JSON.stringify(error, null, 2)}`)
  }
  return undefined
}
