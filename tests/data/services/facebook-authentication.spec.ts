import { type LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { type LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('Facebook Authentication Service', () => {
  const token = 'any_token'

  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepo
    )
  })

  it('should call LoadUserFacebookApi with correct parameters', async () => {
    await sut.execute({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authentication error when LoadUserFacebookApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebokoUserApi returns data', async () => {
    await sut.execute({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
