import { User } from '@prisma/client'
import { list, nonNull, queryField } from 'nexus'
import { Context } from '../../../context'
import { getSessionUser } from '../../../utils'
import { Match, UserOutput } from '../../Models'

export const matchsQuery = queryField('matchs', {
  type: list(nonNull(Match)),
  resolve: async (parent, args, context: Context) => {
    const { id: userId }: User = await getSessionUser(context)
    return await context.prisma.match.findMany({
      where: {
        userId
      },
      include: {
        user: true
      }
    })
  }
})

export const leaderBoardQuery = queryField('leaderBoard', {
  type: list(nonNull(UserOutput)),
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
