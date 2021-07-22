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
    const user = await getSessionUser(context)

    try {
      const match = context.prisma.match.create({
        data: { moves: moves, user: { connect: { id: user?.id } } },
        include: {
          user: true
        }
      })

      if (user?.bestScore && moves > user?.bestScore)
        await context.prisma.user.update({
          where: { id: user.id },
          data: { bestScore: moves }
        })

      return match
    } catch (error) {
      throw new Error(error)
    }
  }
})
