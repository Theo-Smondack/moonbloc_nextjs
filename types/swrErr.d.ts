// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SwrErr extends Error {
  info: Promise<never>
  status: number

  constructor(message: string) {
    super(message)
  }

  getErrorMessage() {
    return 'Something went wrong ' + this.message
  }
}
