import { allow, not, rule, shield } from 'graphql-shield'
import { getSessionInfo } from '../utils'
import { Context } from '../context'

const rules = {
  isAuthenticatedUser: rule()(
    async (_parent: any, _args: any, context: Context) => {
      const { userId, sessionId }: any = getSessionInfo(context)
      const currentSession = await context.prisma.session.findFirst({
        where: {
          userId: userId,
          id: sessionId
        }
      })
      return Boolean(currentSession)
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
      sessions: rules.isAuthenticatedUser
      /*session: rules.isAuthenticatedUser */
    },
    Mutation: {}
  },
  {
    fallbackRule: allow,
    fallbackError: 'Not Authorized!',
    allowExternalErrors: true
  }
)
