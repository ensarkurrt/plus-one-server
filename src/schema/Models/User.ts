import { inputObjectType, objectType } from 'nexus'
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
    t.nonNull.field('user', { type: 'User' })
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
