import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { type TokenGenerator } from '@/data/contracts/cryptography'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly cryptography: TokenGenerator
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: facebookData?.email })
      const facebookAccount = new FacebookAccount(facebookData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(facebookAccount)
      await this.cryptography.generateToken({ key: id, expirationInMiliseconds: AccessToken.expirationInMilliseconds })
    }
    return new AuthenticationError()
  }
}
