import { Resolver, UseMiddleware, Query, Arg } from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'

const firstLetterToLowerCase = (word: string) => `${word.charAt(0).toLowerCase()}${word.slice(1)}`

export const searchBySpeciesResolver = (entity: any, middleware?: Middleware<any>[]) => {
  @Resolver()
  class BaseResolver {
    @Query(() => [entity], { name: `${firstLetterToLowerCase(entity.className)}SearchBySpecies` })
    @UseMiddleware(...(middleware || []))
    searchBySpecies(@Arg('species', () => String) species: string) {
      return entity.find({ species })
    }
  }

  return BaseResolver
}

