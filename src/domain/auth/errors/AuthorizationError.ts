import { DomainError } from '../../errors/DomainError'

export class AuthorizationError extends DomainError {
  public static readonly code = 'authorization_error'

  constructor(message: string) {
    super(AuthorizationError.code, message)
  }
}
