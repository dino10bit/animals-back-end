import { createResolver } from '~/modules/Core/resolvers/createResolver'
import { CreateAnimalInput } from '~/modules/Animal/inputs/CreateAnimal'
import { Animal } from '~/modules/Animal/entities/Animal'
import { Species } from '~/modules/Animal/entities/Species'
import { isAuth } from '~/modules/Auth/middlewares/isAuth'
import { listResolver } from '~/modules/Core/resolvers/listResolver'
import { updateResolver } from '~/modules/Core/resolvers/updateResolver'
import { UpdateAnimalInput } from '~/modules/Animal/inputs/UpdateAnimal'
import { deleteResolver } from '~/modules/Core/resolvers/deleteResolver'
import { detailResolver } from '~/modules/Core/resolvers/detailResolver'
import { searchBySpeciesResolver } from '~/modules/Core/resolvers/searchBySpeciesResolver'
import { speciesListResolver } from '~/modules/Core/resolvers/speciesListResolver'

export const createAnimalResolver = createResolver<typeof CreateAnimalInput>(Animal, CreateAnimalInput, [
  isAuth,
])

export const updateAnimalResolver = updateResolver<typeof UpdateAnimalInput>(Animal, UpdateAnimalInput, [
  isAuth,
])

export const deleteAnimalResolver = deleteResolver(Animal, [isAuth])

export const listAnimalsResolver = listResolver(Animal)

export const animalDetailResolver = detailResolver(Animal)

export const animalSearchBySpeciesResolver = searchBySpeciesResolver(Animal)

export const animalSpeciesListResolver = speciesListResolver(Species)
