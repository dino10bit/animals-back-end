import { Resolver, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql'
import { Middleware } from 'type-graphql/dist/interfaces/Middleware'
import { IAppContext } from '~/types'
import { notFoundError, unauthorizedError } from '~/modules/Core/errors'

export const deleteResolver = (entity: any, middleware?: Middleware<any>[]) => {
  @Resolver()
  class BaseResolver {
    @Mutation(() => entity, { name: `delete${entity.className}` })
    @UseMiddleware(...(middleware || []))
    async delete(@Arg('id', () => Number) id: number, @Ctx() ctx: IAppContext) {
      const entityInstance = await entity.findOne(id)

      if (!entityInstance) {
        throw notFoundError({
          id,
          mutationName: `delete${entity.className}`,
          session: ctx.req.session,
        })
      }

      if (entity.belongsToUser && entityInstance.userId !== ctx.req.session.userId) {
        throw unauthorizedError({
          id,
          mutationName: `delete${entity.className}`,
          session: ctx.req.session,
        })
      }

      entityInstance.remove()

      return entityInstance
    }
  }

  return BaseResolver
}
