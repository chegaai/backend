import jwt, { JwtPayload } from 'jsonwebtoken'
import { AuthorizationError } from '../domain/auth/errors/AuthorizationError'
import { Profile, User } from '@prisma/client'

export function generateLoginToken(user: User & { profile: Profile }) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      profile: user.profile
    },
    process.env['JWT_SECRET'] || '',
    {
      expiresIn: '1h',
      subject: user.id,
      issuer: 'chega.ai',
      audience: 'chega.ai',
      algorithm: 'HS256'
    }
  )
}

export function decodeJwt<T>(token: string): T & JwtPayload {
  const result = jwt.decode(token)

  if (!result || typeof result === 'string') throw new AuthorizationError('Invalid token')

  return result as any
}
