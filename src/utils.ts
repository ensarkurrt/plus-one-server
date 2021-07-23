import { User } from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'
import { Context } from './context'
import { SessionInfo, Token } from './typeDefs'

export const APP_SECRET = process.env.JWT_SECRET as string

export function createSessionToken(user: any): string {
  const token = sign(
    {
      _uid: user.id
    },
    APP_SECRET
  )
  return token
}

export function getSessionInfo(context: Context): SessionInfo {
  const authToken = getToken(context)
  if (!authToken) throw new Error('Incorrect session detail')
  const verifiedToken = verify(authToken, APP_SECRET) as Token
  if (!verifiedToken) throw new Error('Incorrect session detail')

  const data = {
    _uid: verifiedToken._uid,
    token: authToken
  }
  return verifiedToken && data
}

export function getToken(context: Context): string {
  const authHeader = context.req.get('Authorization')
  if (authHeader) return authHeader.replace('Bearer ', '')
  else throw new Error('Access Token not found!')
}

export async function getSessionUser(context: Context) {
  const { _uid }: SessionInfo = getSessionInfo(context)

  if (!_uid) throw new Error(`User not found`)

  const user = (await context.prisma.user.findUnique({
    where: { id: _uid },
    rejectOnNotFound: true
  })) as User

  if (!user) throw new Error(`User not found`)

  return user
}
