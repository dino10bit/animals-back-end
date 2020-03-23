import { In } from 'typeorm'
import * as R from 'ramda'
import DataLoader from 'dataloader'
import { Animal } from '~/modules/Animal/entities/Animal'

export const animalsByUserIds = async (userIds: number[]) => {
  const animals = await Animal.find({
    where: { userConnection: { id: In(userIds) } },
  })

  // @ts-ignore
  const groupedAnimals = R.groupBy(R.prop('userId'))(animals)

  // @ts-ignore
  return R.map((userId: string) => groupedAnimals[userId] || [])(userIds)
}

export const AnimalsByUserIdsLoader = new DataLoader(animalsByUserIds)

export const findAnimalsByUserId = (userId: number) =>
  AnimalsByUserIdsLoader.load(userId) as Promise<Animal[] | []>
