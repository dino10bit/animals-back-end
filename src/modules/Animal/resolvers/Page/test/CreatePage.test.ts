import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { crypto } from '~/modules/Auth/services/crypto'

const createAnimalQuery = `
  mutation CreateAnimal($data: CreateAnimalInput!) {
    createAnimal(data: $data) {
      id
      name
      uri
      species
      user {
        id
        email
      }
    }
  }
`

const createAnimalWithRecursionQuery = `
  mutation CreateAnimal($data: CreateAnimalInput!) {
    createAnimal(data: $data) {
      id
      name
      species
      uri
      user {
        id
        email
        animals {
          id
          name
          species
          uri
          user {
            id
            email
          }
        }
      }
    }
  }
`

const requestCreateAnimal = (
  data: { name: string; species: string },
  query: string,
  jwtToken?: string
) =>
  gCall({
    source: query,
    variableValues: { data },
    contextValue: {
      req: {
        headers: {
          ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
        },
      },
    },
  })

describe('[resolver] CreateAnimal', () => {
  const animalData = {
    name: 'Prince of Barkness',
    species: 'dog',
    uri: 'http://https://placedog.net/600/340',
  }
  const expectedAnimalUri = animalData.uri

  describe('when user is not logged in', () => {
    it('should not create anything', async () => {
      const response = await requestCreateAnimal(animalData, createAnimalQuery)

      expect(response.errors).toBeTruthy()
      expect(response.data).toBeNull()
    })
  })

  describe('when user logged in', () => {
    it('create new Animal', async () => {
      const user = await createUser()
      await user.save()
      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestCreateAnimal(animalData, createAnimalQuery, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.createAnimal).toMatchObject({
        ...animalData,
        uri: expectedAnimalUri,
        user: {
          id: String(user.id),
          email: user.email,
        },
      })
    })

    it('should handle recursive queries', async () => {
      const user = await createUser()
      await user.save()
      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestCreateAnimal(animalData, createAnimalWithRecursionQuery, jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.createAnimal).toMatchObject({
        ...animalData,
        uri: expectedAnimalUri,
        user: {
          id: String(user.id),
          email: user.email,
          Animals: [
            {
              ...animalData,
              uri: expectedAnimalUri,
              user: {
                id: String(user.id),
                email: user.email,
              },
            },
          ],
        },
      })
    })
  })
})
