import { inputObjectType, objectType } from 'nexus'
import { Context } from '../../context'
import { Match } from './Match'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.int('bestScore')
    t.list.nonNull.field('matchs', {
      type: Match
    })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
  }
})

export const UserOutput = objectType({
  name: 'UserOutput',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.nonNull.int('bestScore')
    t.nonNull.int('matchCount', {
      resolve: async ({ id }, _, context: Context) => {
        return await context.prisma.match.count({
          where: {
            userId: id
          }
        })
      }
    })
    t.nonNull.int('rank', {
      resolve: async ({ id }, _a, context: Context) => {
        const users = await context.prisma.user.findMany({
          take: 99,
          orderBy: {
            bestScore: 'asc'
          },
          where: {
            bestScore: {
              gt: 0
            }
          }
        })
        const rank = users.findIndex((user) => user.id === id)
        return rank == -1 ? 0 : rank + 1
      }
    })
    t.list.nonNull.field('matchs', {
      type: Match
    })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
  }
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('token')
    t.nonNull.field('user', { type: UserOutput })
  }
})

export const SignUpInput = inputObjectType({
  name: 'SignUpInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('username')
    t.nonNull.string('password')
  }
})

export const SignInInput = inputObjectType({
  name: 'SignInInput',
  definition(t) {
    t.nonNull.string('username')
    t.nonNull.string('password')
  }
})
