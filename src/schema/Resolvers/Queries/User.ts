import { nonNull, queryField } from 'nexus'
import { Context } from '../../../context'
import { getSessionInfo } from '../../../utils'
import { UserOutput } from '../../Models/User'

export const meQuery = queryField('me', {
  type: nonNull(UserOutput),
  resolve: async (parent, args, context: Context) => {
    const { _uid }: any = getSessionInfo(context)
    return await context.prisma.user.findUnique({
      where: {
        id: _uid
      },
      rejectOnNotFound: true
    })
  }
})
