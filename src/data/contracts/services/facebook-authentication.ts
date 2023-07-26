import { type CreateFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookAccountRepo: CreateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUserApi.loadUser(params)

    if (facebookData !== undefined) {
      await this.loadUserAccountRepo.load({ email: facebookData?.email })
      await this.createFacebookAccountRepo.createFromFacebook(facebookData)
    }
    return new AuthenticationError()
  }
}
