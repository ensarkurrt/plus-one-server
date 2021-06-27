import { Prisma } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { mutationField, nonNull, stringArg } from 'nexus'
import { Context } from '../../../context'
import { APP_SECRET } from '../../../utils'
import moment from 'moment-timezone'

export const signupMutation = mutationField('signup', {
  type: 'AuthPayload',
  args: {
    username: nonNull(stringArg()),
    email: nonNull(stringArg()),
    password: nonNull(stringArg())
  },
  async resolve(parent, { password, username, email }, context) {
    const hashedPassword = await hash(password, 10)
    try {
      const user = await context.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword
        }
      })

      const token = sign({ _uid: user.id }, APP_SECRET)

      const session = await context.prisma.session.create({
        data: {
          token,
          sessionData: {
            createMany: {
              data: [
                {
                  key: 'ip',
                  value: '1.1.1.1'
                },
                {
                  key: 'device',
                  value: 'iPhoneXr'
                }
              ]
            }
          },
          user: {
            connect: {
              id: user.id
            }
          }
        }
      })
      const generatedToken = session.id + '|' + token

      return {
        token: generatedToken,
        user
      }
    } catch (error) {
      throw new Error(error)
    }
  }
})

export const signinMutation = mutationField('signin', {
  type: 'AuthPayload',
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg())
  },
  resolve: async (_parent, { email, password }, context: Context) => {
    const user = await context.prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      throw new Error(`No user found for email: ${email}`)
    }
    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      throw new Error('Invalid password')
    }

    //MOMENT TIMEZONE https://momentjs.com/timezone/
    //TODO:: add exp date
    const token = sign(
      {
        _uid: user.id
      },
      APP_SECRET
    )

    //TODO:: set real data
    const session = await context.prisma.session.create({
      data: {
        token,
        sessionData: {
          createMany: {
            data: [
              {
                key: 'ip',
                value: '1.1.1.1'
              },
              {
                key: 'device',
                value: 'iPhoneXr'
              }
            ],
            skipDuplicates: false
          }
        },
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })
    const generatedToken = session.id + '|' + token

    return {
      token: generatedToken,
      user
    }
  }
})
