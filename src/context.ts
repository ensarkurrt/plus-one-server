import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  errorFormat: 'minimal', // minimal, pretty
  rejectOnNotFound: true,
  log: ['query']
})

export interface Context {
  prisma: PrismaClient
  req: any // HTTP request carrying the `Authorization` header
}

export function createContext(req: any) {
  return {
    ...req,
    prisma
  }
}
