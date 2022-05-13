import { Context } from '../../context'
import { ProfileAlreadyExistsError } from './errors/ProfileAlreadyExistsError'
import { AuthenticationError } from './errors/AuthenticationError'
import { createArgon2Hash, verifyArgon2Hash } from '../../util/hash'
import {
  ProfileCreationParams,
  ProfileCreationSchema
} from './schemas/create-profile'
import { LoginParams, LoginSchema } from './schemas/login'
import { generateLoginToken } from '../../util/jwt'
import { PrismaClient } from '@prisma/client'

export class AuthService {
  readonly #prisma: PrismaClient

  constructor(context: Context) {
    this.#prisma = context.prisma
  }

  async emailExists(email: string) {
    const user = await this.#prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })
    return user !== null
  }

  async taxIdExists(taxId: string) {
    const user = await this.#prisma.profile.findUnique({
      where: { taxId },
      select: { id: true }
    })
    return user !== null
  }

  async idNumberExists(idNumber: string) {
    const user = await this.#prisma.profile.findUnique({
      where: { idNumber },
      select: { id: true }
    })
    return user !== null
  }

  async signup(rawData: ProfileCreationParams) {
    const data = ProfileCreationSchema.parse(rawData)

    const { email, password, ...profileData } = data
    const { taxId, idNumber } = profileData

    const existingProfile = await this.#prisma.profile.findMany({
      where: { OR: [{ taxId }, { idNumber }, { user: { email } }] },
      select: { id: true }
    })

    if (existingProfile.length) {
      throw new ProfileAlreadyExistsError()
    }

    const hashedPassword = await createArgon2Hash(password)

    const user = await this.#prisma.user.create({
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

  async login(rawData: LoginParams) {
    const data = LoginSchema.parse(rawData)

    const { email, password } = data

    const user = await this.#prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })

    if (
      !user ||
      !user.profile ||
      !(await verifyArgon2Hash(password, user.password))
    ) {
      throw new AuthenticationError('Invalid email or password')
    }

    const { profile, ...userInfo } = user

    if (!profile) {
      throw new AuthenticationError(`No profile for user with email ${email}`)
    }

    return generateLoginToken({ ...userInfo, profile })
  }
}
