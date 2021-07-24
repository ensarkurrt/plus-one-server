import { User } from '@prisma/client'
import { arg, mutationField, nonNull } from 'nexus'
import { getSessionUser } from '../../../utils'
import { Match, SaveMatchInput } from '../../Models/Match'

export const saveMatchMutation = mutationField('saveMatch', {
  type: Match,
  args: {
    input: nonNull(
      arg({
        type: SaveMatchInput
      })
    )
  },
  async resolve(parent, { input }, context) {
    const { moves } = input
    const { id, bestScore }: User = await getSessionUser(context)

    try {
      const match = context.prisma.match.create({
        data: { moves, user: { connect: { id } } },
        include: {
          user: true
        }
      })

      if (moves < bestScore)
        await context.prisma.user.update({
          where: { id },
          data: { bestScore: moves }
        })

      return match
    } catch (error) {
      throw new Error(error)
    }
  }
})
