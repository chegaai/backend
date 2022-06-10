export abstract class DomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
  }

  get details(): any {
    return null
  }
}
