import { DomainError } from '../../errors/DomainError'

export class CommunityDoesNotExistError extends DomainError {
  public static readonly code = 'community_does_not_exist'

  constructor(id: string) {
    super(
      CommunityDoesNotExistError.code,
      `community with id ${id} does not exist`
    )
  }
}
