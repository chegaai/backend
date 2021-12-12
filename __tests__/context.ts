import { PrismaClient } from '.prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { Context } from '../src/context'
export * from '../src/context'

export type MockContext = {
  [key in keyof Context]: DeepMockProxy<Context[key]>
}

export const createMockContext = (): MockContext => ({
  prisma: mockDeep<PrismaClient>()
})
