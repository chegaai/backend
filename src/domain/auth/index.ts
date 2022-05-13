import { Context } from '../../context'
import { ProfileAlreadyExistsError } from './errors/ProfileAlreadyExistsError'
import { AuthenticationError } from './errors/AuthenticationError'
import { createArgon2Hash, verifyArgon2Hash } from '../../util/hash'
import { ProfileCreationParams, ProfileCreationSchema } from './schemas/create-profile'
import { LoginParams, LoginSchema } from './schemas/login'
import { generateLoginToken } from '../../util/jwt'

const emailExists =
  ({ prisma }: Context) =>
  async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    return user !== null
  }

const taxIdExists =
  ({ prisma }: Context) =>
  async (taxId: string) => {
    const user = await prisma.profile.findUnique({ where: { taxId }, select: { id: true } })
    return user !== null
  }

const idNumberExists =
  ({ prisma }: Context) =>
  async (idNumber: string) => {
    const user = await prisma.profile.findUnique({ where: { idNumber }, select: { id: true } })
    return user !== null
  }

const signup =
  ({ prisma }: Context) =>
  async (rawData: ProfileCreationParams) => {
    const data = ProfileCreationSchema.parse(rawData)

    const { email, password, ...profileData } = data
    const { taxId, idNumber } = profileData

    const existingProfile = await prisma.profile.findMany({
      where: { OR: [{ taxId }, { idNumber }, { user: { email } }] },
      select: { id: true }
    })

    if (existingProfile.length) {
      throw new ProfileAlreadyExistsError()
    }

    const hashedPassword = await createArgon2Hash(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: profileData
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
        password: false
      }
    })

    return user
  }

const login = (ctx: Context) => async (rawData: LoginParams) => {
  const data = LoginSchema.parse(rawData)

  const { email, password } = data

  const user = await ctx.prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })

  if (!user || !user.profile || !(await verifyArgon2Hash(password, user.password))) {
    throw new AuthenticationError('Invalid email or password')
  }

  const { profile, ...userInfo } = user

  if (!profile) {
    throw new AuthenticationError(`No profile for user with email ${email}`)
  }

  return generateLoginToken({ ...userInfo, profile })
}

export const createAuthService = (ctx: Context) => ({
  emailExists: emailExists(ctx),
  taxIdExists: taxIdExists(ctx),
  idNumberExists: idNumberExists(ctx),
  signup: signup(ctx),
  login: login(ctx)
})

export type AuthService = ReturnType<typeof createAuthService>

export default {
  createAuthService,
  emailExists,
  taxIdExists,
  idNumberExists
}
