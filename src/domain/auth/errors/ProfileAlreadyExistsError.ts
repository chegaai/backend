import { DomainError } from '../../errors/DomainError'

export class ProfileAlreadyExistsError extends DomainError {
  public static readonly code = 'profile_already_exists'

  constructor() {
    super(ProfileAlreadyExistsError.code, 'Profile already exists')
  }
}
