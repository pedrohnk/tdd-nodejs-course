import { type UpdateFacebookAccountRepository, type CreateFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)
    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: facebookData?.email })
      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? facebookData.name,
          facebookId: facebookData.facebookId
        })
      } else {
        await this.userAccountRepo.createFromFacebook(facebookData)
      }
    }
    return new AuthenticationError()
  }
}
