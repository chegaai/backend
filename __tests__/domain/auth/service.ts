import { Profile } from '@prisma/client'
import { ZodError } from 'zod'
import {
  AuthenticationError,
  ProfileAlreadyExistsError
} from '../../../src/domain/auth/errors'
import { AuthService } from '../../../src/domain/auth'
import { createArgon2Hash, decodeJwt, omit } from '../../../src/util'
import { Context, createContext } from '../../context'
import { PROFILE_FIXTURE, USER_FIXTURE } from '../../fixtures'

describe('auth service', () => {
  let ctx: Context
  let authService: AuthService

  beforeAll(() => {
    ctx = createContext()
    authService = new AuthService(ctx)
  })

  afterEach(async () => {
    await ctx.prisma.profile.deleteMany()
    await ctx.prisma.user.deleteMany()
  })

  describe('signup', () => {
    const SIGNUP_FIXTURE = {
      email: USER_FIXTURE.email,
      password: USER_FIXTURE.password,
      dateOfBirth: PROFILE_FIXTURE.dateOfBirth.toString(),
      idNumber: PROFILE_FIXTURE.idNumber,
      name: PROFILE_FIXTURE.name,
      lastName: PROFILE_FIXTURE.lastName,
      taxId: PROFILE_FIXTURE.taxId
    }

    it('should fail if schema is invalid', async () => {
      expect.assertions(1)
      return expect(authService.signup({} as any)).rejects.toThrow(ZodError)
    })

    it('should fail if profile exists', async () => {
      expect.assertions(1)

      await ctx.prisma.user.create({
        data: {
          ...USER_FIXTURE,
          profile: {
            create: (({ userId, ...profile }: Profile) => ({ ...profile }))(
              PROFILE_FIXTURE
            )
          }
        }
      })

      return expect(authService.signup(SIGNUP_FIXTURE)).rejects.toThrow(
        ProfileAlreadyExistsError
      )
    })

    it('should create user and profile', async () => {
      expect.assertions(1)

      return expect(authService.signup(SIGNUP_FIXTURE)).resolves.toEqual({
        ...omit(USER_FIXTURE, ['password', 'provider', 'providerId']),
        id: expect.any(String),
        profile: {
          ...PROFILE_FIXTURE,
          id: expect.any(String),
          userId: expect.any(String)
        }
      })
    })
  })

  describe('login', () => {
    const LOGIN_FIXTURE = {
      email: USER_FIXTURE.email,
      password: 'senhaSenhaForte123!'
    }

    it('should fail if schema is invalid', async () => {
      expect.assertions(3)
      return Promise.all([
        expect(authService.login({} as any)).rejects.toThrow(ZodError),
        expect(
          authService.login({ email: LOGIN_FIXTURE.email, password: '' })
        ).rejects.toThrow(ZodError),
        expect(
          authService.login({ email: '', password: LOGIN_FIXTURE.password })
        ).rejects.toThrow(ZodError)
      ])
    })

    it('should fail if user does not exist', async () => {
      expect.assertions(1)
      return expect(authService.login(LOGIN_FIXTURE)).rejects.toThrow(
        AuthenticationError
      )
    })

    it('should fail if password is not correct', async () => {
      await ctx.prisma.user.create({
        data: {
          ...USER_FIXTURE,
          profile: {
            create: (({ userId, ...profile }: Profile) => ({ ...profile }))(
              PROFILE_FIXTURE
            )
          }
        }
      })

      expect.assertions(1)

      return expect(
        authService.login({ ...LOGIN_FIXTURE, password: 'senhaSenhaForte123@' })
      ).rejects.toThrow(AuthenticationError)
    })

    it('should return a valid token when login and password are valid', async () => {
      await ctx.prisma.user.create({
        data: {
          ...USER_FIXTURE,
          password: await createArgon2Hash(LOGIN_FIXTURE.password),
          profile: {
            create: (({ userId, ...profile }: Profile) => ({ ...profile }))(
              PROFILE_FIXTURE
            )
          }
        }
      })

      expect.assertions(4)

      const token = await authService.login(LOGIN_FIXTURE)
      const payload = decodeJwt(token)

      expect(token).toEqual(expect.any(String))
      expect(payload).not.toHaveProperty('password')
      expect(payload).toHaveProperty('id')
      expect(payload).toHaveProperty('profile')
    })
  })

  describe('emailExists', () => {
    it('should return true if user with email exists', async () => {
      expect.assertions(1)

      await ctx.prisma.user.create({ data: USER_FIXTURE })

      return expect(authService.emailExists(USER_FIXTURE.email)).resolves.toBe(
        true
      )
    })

    it('should return false if user with email does not exist', async () => {
      return expect(authService.emailExists(USER_FIXTURE.email)).resolves.toBe(
        false
      )
    })
  })

  describe('taxIdExists | idNumberExists', () => {
    it('should return true if profile with taxId or idNumber exists', async () => {
      expect.assertions(2)

      await ctx.prisma.user.create({
        data: {
          ...USER_FIXTURE,
          profile: { create: omit(PROFILE_FIXTURE, ['userId']) }
        }
      })

      return Promise.all([
        expect(authService.taxIdExists(PROFILE_FIXTURE.taxId)).resolves.toBe(
          true
        ),
        expect(
          authService.idNumberExists(PROFILE_FIXTURE.idNumber)
        ).resolves.toBe(true)
      ])
    })

    it('should return false if profile with taxId or idNumber does not exist', async () => {
      expect.assertions(2)

      return Promise.all([
        expect(authService.taxIdExists(PROFILE_FIXTURE.taxId)).resolves.toBe(
          false
        ),
        expect(
          authService.idNumberExists(PROFILE_FIXTURE.idNumber)
        ).resolves.toBe(false)
      ])
    })
  })
})
