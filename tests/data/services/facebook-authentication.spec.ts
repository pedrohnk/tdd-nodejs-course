import { type FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async execute (params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser(params)
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('Facebook Authentication Service', () => {
  it('should call LoadUserFacebookApi with correct parameters', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token')
  })
})
