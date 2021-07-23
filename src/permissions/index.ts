import { allow, rule, shield } from 'graphql-shield'
import { Context } from '../context'
import { getSessionInfo } from '../utils'

const rules = {
  isAuthenticatedUser: rule()(
    async (_parent: any, _args: any, context: Context) => {
      const { _uid, token }: any = getSessionInfo(context)
      return Boolean(_uid)
    }
  ),
  isPostOwner: rule()(async (_parent: any, args: any, context: Context) => {
    /*     const { userId, sessionId }: any = getSessionInfo(context)
    const author = await context.prisma.post
      .findUnique({
        where: {
          id: Number(args.id)
        }
      })
      .author()
    return userId === author?.id */
    return true
  })
}

export const permissions = shield(
  {
    Query: {
      me: rules.isAuthenticatedUser,
      matchs: rules.isAuthenticatedUser
      /* leaderBoard: rules.isAuthenticatedUser */
    },
    Mutation: { saveMatch: rules.isAuthenticatedUser }
  },
  {
    fallbackRule: allow,
    fallbackError: 'Not Authorized!',
    allowExternalErrors: true
  }
)
