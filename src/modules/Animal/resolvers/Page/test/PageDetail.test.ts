import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createAnimal } from '~/modules/Animal/fixtures'

const animalDetailQuery = `
  query AnimalDetail($id: Float!){
    animalDetail(id: $id) {
      id
      name
      species
    }
  }
`

const requestAnimalDetail = (id: number) =>
  gCall({
    source: animalDetailQuery,
    variableValues: { id },
  })

describe('[resolver] ListAnimals', () => {
  it('should return existing animal', async () => {
    const user = await createUser()
    await user.save()

    const animal = createAnimal(user)
    await animal.save()

    const response = await requestAnimalDetail(animal.id)

    expect(response.errors).toBeUndefined()
    expect(response.data.animalDetail).toMatchObject({
      id: String(animal.id),
      name: animal.name,
      species: animal.species,
    })
  })

  describe('when animal does not exist', () => {
    it('should return error', async () => {
      const response = await requestAnimalDetail(99)

      expect(response.errors).toBeTruthy()
      expect(response.data).toEqual(null)
    })
  })
})
