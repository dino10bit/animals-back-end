import { graphql, GraphQLSchema } from 'graphql'
import { createSchema } from '~/createSchema'

type Maybe<T> = null | undefined | T

interface Options {
  source: string
  variableValues?: Maybe<{
    [key: string]: string | number | object
  }>
  contextValue?: any
}

let schema: GraphQLSchema

export const gCall = async ({ source, variableValues, contextValue }: Options) => {
  if (!schema) {
    schema = await createSchema()
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue,
  })
}
