import { Resolver, UseMiddleware, Query } from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'

export const speciesListResolver = (entity: any, middleware?: Middleware<any>[]) => {
  @Resolver()
  class BaseResolver {
    @Query(() => [entity], { name: `speciesList` })
    @UseMiddleware(...(middleware || []))
    list() {
      return entity.find()
    }
  }

  return BaseResolver
}
