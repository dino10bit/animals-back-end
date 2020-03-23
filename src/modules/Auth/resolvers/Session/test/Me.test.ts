import { createUser } from '~/modules/Auth/fixtures'
import { gCall } from '~/test-utils/gCall'
import { crypto } from '~/modules/Auth/services/crypto'
import { createAnimal } from '~/modules/Animal/fixtures'

const meQuery = `
  query {
    me {
      id
      email
      firstName
      lastName
      animals {
        id
        name
        uri
        species
      }
    }
  }
`

const requestMe = (jwtToken?: string) =>
  gCall({
    source: meQuery,
    contextValue: {
      req: {
        headers: {
          ...(jwtToken && { authorization: `Bearer ${jwtToken}` }),
        },
      },
    },
  })

describe('[resolver] Me', () => {
  it('should not return anything', async () => {
    const response = await requestMe()

    expect(response.errors).toBeTruthy()
    expect(response.data.me).toBeNull()
  })

  describe('when user logged in', () => {
    it('should return user information', async () => {
      const user = await createUser()
      await user.save()
      const jwtToken = await crypto.generateAccessToken(user)

      const response = await requestMe(jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.me).toMatchObject({
        id: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        animals: [],
      })
    })
  })

  describe('when user has animals', () => {
    it('should return user with animals', async () => {
      const user = await createUser()
      await user.save()

      const firstAnimal = createAnimal(user)
      const secondAnimal = createAnimal(user)

      const [jwtToken, dbFirstAnimal, dbSecondAnimal] = await Promise.all([
        crypto.generateAccessToken(user),
        firstAnimal.save(),
        secondAnimal.save(),
      ])

      const response = await requestMe(jwtToken)

      expect(response.errors).toBeUndefined()
      expect(response.data.me).toMatchObject({
        id: String(user.id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      expect(response.data.me.animals.length).toEqual(2)
      expect(response.data.me.animals[0]).toMatchObject({
        id: String(dbFirstAnimal.id),
        name: dbFirstAnimal.name,
        species: dbFirstAnimal.species,
        uri: dbFirstAnimal.uri,
      })
      expect(response.data.me.animals[1]).toMatchObject({
        id: String(dbSecondAnimal.id),
        name: dbSecondAnimal.name,
        species: dbSecondAnimal.species,
        uri: dbSecondAnimal.uri,
      })
    })
  })
})
