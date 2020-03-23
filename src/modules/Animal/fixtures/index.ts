import * as R from 'ramda'
import faker from 'faker'
import { User } from '~/modules/Auth/entities/User'
import { Animal } from '~/modules/Animal/entities/Animal'

export interface IDefaultAnimal {
  name: string
  species: string
  uri: string
}

export const createAnimal = (user: User, data?: IDefaultAnimal) => {
  const animal = new Animal()
  animal.userConnection = user
  animal.name = R.prop('name')(data) || faker.lorem.words(4)
  animal.species = R.prop('species')(data) || faker.lorem.text()
  animal.uri = R.prop('uri')(data) || faker.lorem.text()

  return animal
}
