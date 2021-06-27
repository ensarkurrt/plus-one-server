import { nonNull, objectType } from 'nexus'

import { Context } from '../../context'

export const Session = objectType({
  name: 'Session',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('token')
    //TODO:: Scalars with upgrade
    t.nonNull.list.nonNull.field('sessionData', {
      type: 'SessionDataPayload',
      resolve({ id }, _, context) {
        return context.prisma.session
          .findUnique({ where: { id } })
          .sessionData()
      }
    })
    t.field('user', {
      type: 'User',
      resolve({ id }, _, context) {
        return context.prisma.session
          .findUnique({
            where: { id }
          })
          .user()
      }
    })
    t.nonNull.field('usedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
  }
})
export const SessionData = objectType({
  name: 'SessionData',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('key')
    t.nonNull.string('value')
    t.field('session', {
      type: 'Session',
      resolve({ id }, _, context) {
        return context.prisma.sessionData
          .findUnique({
            where: { id }
          })
          .session()
      }
    })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
  }
})

export const SessionPayload = objectType({
  name: 'SessionPayload',
  definition(t) {
    t.nonNull.list.nonNull.field('sessionData', {
      type: 'SessionDataPayload',
      resolve({ id }, _, context) {
        return context.prisma.session
          .findUnique({ where: { id } })
          .sessionData()
      }
    })
    t.nonNull.field('usedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
  }
})

export const SessionDataPayload = objectType({
  name: 'SessionDataPayload',
  definition(t) {
    t.nonNull.string('key')
    t.nonNull.string('value')
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
  }
})
