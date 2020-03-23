import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { createAnimal } from '~/modules/Animal/fixtures'
import { crypto } from '~/modules/Auth/services/crypto'

const deleteAnimalQuery = `
  mutation DeleteAnimal($id: Float!){
    deleteAnimal(id: $id) {
      id
      user {
        id
      }
    }
  }
`

const requestDeleteAnimal = (id: number, jwtToken?: string) =>
  gCall({
    source: deleteAnimalQuery,
    variableValues: {
      id,
    },
    contextValue: {
      req: {
        headers: {
          ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
        },
      },
    },
  })

describe('[resolver] deleteAnimal', () => {
  describe('when unauthorized', () => {
    it('should throw an error', async () => {
      const response = await requestDeleteAnimal(99)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })

  describe('when authorized', () => {
    it('should delete my animal', async () => {
      const user = await createUser()
      await user.save()

      const animal = createAnimal(user)
      await animal.save()

      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestDeleteAnimal(animal.id, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.deleteAnimal).toMatchObject({
        id: String(animal.id),
        user: {
          id: String(user.id),
        },
      })
    })

    it("should NOT update other people's animals", async () => {
      const me = await createUser()
      await me.save()

      const otherUser = await createUser()
      await otherUser.save()

      const othersAnimal = createAnimal(otherUser)
      await othersAnimal.save()

      const jwtToken = await crypto.generateAccessToken(me)

      const response = await requestDeleteAnimal(othersAnimal.id, jwtToken)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })
})
