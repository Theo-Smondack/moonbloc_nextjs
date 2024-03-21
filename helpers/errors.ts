export class BadRequestError extends Error {
  constructor(
    message: string,
    public options: Record<string, unknown> = {},
    public status: number = 400
  ) {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string,
    public options: Record<string, unknown> = {},
    public status: number = 404
  ) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export type ErrorType = BadRequestError | NotFoundError
