import { DomainError } from '../../errors/DomainError'

export class AuthenticationError extends DomainError {
  public static readonly code = 'authentication_error'

  constructor(message: string) {
    super(AuthenticationError.code, message)
  }
}
