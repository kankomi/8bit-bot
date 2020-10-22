import { GraphQLError } from 'graphql'

export function formatGraphQlErrors(errors: readonly GraphQLError[]): string {
  return errors.map((e) => `'${e.message}'`).join(', ')
}
