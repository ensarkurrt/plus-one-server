import { compare, hash } from 'bcryptjs'
import { arg, mutationField, nonNull } from 'nexus'
import { Context } from '../../../context'
import { createSessionToken } from '../../../utils'
import { AuthPayload, SignInInput, SignUpInput } from '../../Models/User'

export const SignUpMutation = mutationField('signUp', {
  type: nonNull(AuthPayload),
  args: {
    input: nonNull(
      arg({
        type: SignUpInput
      })
    )
  },
  async resolve(parent, { input }, context) {
    const { email, password, username } = input
    const _password = await hash(password, 10)
    try {
      const user = await context.prisma.user.create({
        data: {
          username,
          email,
          password: _password
        }
      })
      const token = createSessionToken(user)

      return {
        token,
        user
      }
    } catch (error) {
      throw new Error(error)
    }
  }
})

export const SignInMutation = mutationField('signIn', {
  type: nonNull(AuthPayload),
  args: {
    input: nonNull(
      arg({
        type: SignInInput
      })
    )
  },
  resolve: async (_parent, { input }, context: Context) => {
    const { username, password } = input
    const user = await context.prisma.user.findUnique({
      where: {
        username
      },
      rejectOnNotFound: true
    })
    if (!user) throw new Error(`No user found for username: ${username}`)

    const passwordValid = await compare(password, user.password)
    if (!passwordValid) throw new Error('Invalid password')

    const token = createSessionToken(user)
    return {
      token,
      user
    }
  }
})
