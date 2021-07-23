import { User } from '@prisma/client'
import { nonNull, queryField } from 'nexus'
import { Context } from '../../../context'
import { getSessionUser } from '../../../utils'
import { UserOutput } from '../../Models/User'

export const meQuery = queryField('me', {
  type: nonNull(UserOutput),
  resolve: async (parent, args, context: Context) => {
    const user: User = await getSessionUser(context)
    return user
  }
})
