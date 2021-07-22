import { list, queryField } from 'nexus'
import { Context } from '../../../context'
import { getSessionInfo } from '../../../utils'
import { Match, UserOutput } from '../../Models'

export const matchsQuery = queryField('matchs', {
  type: list(Match),
  resolve: async (parent, args, context: Context) => {
    const { _uid }: any = getSessionInfo(context)
    return await context.prisma.match.findMany({
      where: {
        userId: _uid
      },
      include: {
        user: true
      }
    })
  }
})

export const leaderBoardQuery = queryField('leaderBoard', {
  type: list(UserOutput),
  resolve: async (parent, args, context: Context) => {
    return await context.prisma.user.findMany({
      orderBy: {
        bestScore: 'asc'
      },
      where: {
        bestScore: {
          gt: 0
        }
      }
    })
  }
})
