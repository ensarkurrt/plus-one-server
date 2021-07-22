import { inputObjectType, objectType } from 'nexus'
import { UserOutput } from './User'

export const Match = objectType({
  name: 'Match',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.int('moves')
    t.nonNull.field('user', { type: UserOutput })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.field('createdAt', { type: 'DateTime' })
  }
})

export const SaveMatchInput = inputObjectType({
  name: 'SaveMatchInput',
  definition(t) {
    t.nonNull.int('moves')
  }
})
