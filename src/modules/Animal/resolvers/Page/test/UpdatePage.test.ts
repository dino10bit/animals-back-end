import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createAnimal } from '~/modules/Animal/fixtures'
import { crypto } from '~/modules/Auth/services/crypto'

const updateAnimalQuery = `
  mutation UpdateAnimal($data: UpdateAnimalInput!) {
    updateAnimal(data: $data) {
      id
      uri
      name
      species
      user {
        id
        email
      }
    }
  }
`

const requestUpdateAnimal = (data: { id: number; uri: string; name: string; species: string }, jwtToken?: string) =>
  gCall({
    source: updateAnimalQuery,
    variableValues: {
      data,
    },
    contextValue: {
      req: {
        headers: {
          ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
        },
      },
    },
  })

describe('[resolver] updateAnimal', () => {
  const newAnimalData = {
    name: 'new name',
    species: 'new species',
    uri: '',
  }

  describe('when unauthorized', () => {
    it('should throw an error', async () => {
      const response = await requestUpdateAnimal({ id: 99, ...newAnimalData })

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })

  describe('when authorized', () => {
    it('should update my Animal', async () => {
      const user = await createUser()
      await user.save()

      const animal = createAnimal(user)
      await animal.save()

      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestUpdateAnimal({ id: animal.id, ...newAnimalData }, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.updateAnimal).toEqual({
        id: String(animal.id),
        uri: animal.uri,
        ...newAnimalData,
        user: {
          id: String(user.id),
          email: user.email,
        },
      })
    })

    it("should NOT update other people's Animals", async () => {
      const me = await createUser()
      await me.save()

      const otherUser = await createUser()
      await otherUser.save()

      const othersAnimal = createAnimal(otherUser)
      await othersAnimal.save()

      const jwtToken = await crypto.generateAccessToken(me)

      const response = await requestUpdateAnimal({ id: othersAnimal.id, ...newAnimalData }, jwtToken)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })
})
