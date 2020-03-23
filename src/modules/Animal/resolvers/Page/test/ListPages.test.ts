import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createAnimal } from '~/modules/Animal/fixtures'

const listAnimalsQuery = `
  query {
    listAnimals {
      id
      uri
      name
      species
    }
  }
`

const requestListAnimals = () =>
  gCall({
    source: listAnimalsQuery,
  })

describe('[resolver] ListAnimals', () => {
  it('should return all animals', async () => {
    const user = await createUser()
    await user.save()

    const firstAnimal = createAnimal(user)
    const secondAnimal = createAnimal(user)
    const thirdAnimal = createAnimal(user)

    await Promise.all([firstAnimal.save(), secondAnimal.save(), thirdAnimal.save()])

    const response = await requestListAnimals()

    expect(response.errors).toBeUndefined()
    expect(response.data.listAnimals.length).toEqual(3)
  })

  describe('when there are no Animals', () => {
    it('should return empty list', async () => {
      const response = await requestListAnimals()

      expect(response.errors).toBeUndefined()
      expect(response.data.listAnimals).toEqual([])
    })
  })
})
