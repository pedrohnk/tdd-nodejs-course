import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  callsCount = 0
  result = undefined

  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('Facebook Authentication Service', () => {
  it('should call LoadUserFacebookApi with correct parameters', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserApi.token).toBe('any_token')
    expect(loadFacebookUserApi.callsCount).toBe(1)
  })

  it('should return authentication error when LoadUserFacebookApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
