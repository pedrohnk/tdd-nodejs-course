import { type TokenGenerator } from '@/data/contracts/cryptography'

import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMiliseconds / 1000
    return sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
