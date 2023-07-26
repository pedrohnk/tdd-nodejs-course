export class AccessToken {
  constructor (private readonly value: string) {}

  static get expirationInMilliseconds (): number {
    return 30 * 60 * 1000
  }
}
