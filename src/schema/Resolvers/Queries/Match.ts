import { User } from '@prisma/client'
import { arg, list, nonNull, queryField } from 'nexus'
import { Context } from '../../../context'
import { getSessionUser } from '../../../utils'
import { LeaderBoardInput, Match, UserOutput } from '../../Models'

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
  args: {
    input: arg({
      type: LeaderBoardInput
    })
  },
  resolve: async (parent, { input }, context: Context) => {
    const { limit, cursor }: any = input
    if (cursor != null)
      return await context.prisma.user.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: cursor
        },
        orderBy: {
          bestScore: 'asc'
        },
        where: {
          bestScore: {
            gt: 0
          }
        }
      })
    else
      return await context.prisma.user.findMany({
        take: limit,
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
