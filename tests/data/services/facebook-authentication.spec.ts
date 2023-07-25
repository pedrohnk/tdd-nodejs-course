import { type LoadFacebookUserApi } from './../../../src/data/contracts/apis/facebook'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'

import { mock } from 'jest-mock-extended'

describe('Facebook Authentication Service', () => {
  it('should call LoadUserFacebookApi with correct parameters', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    await sut.execute({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authentication error when LoadUserFacebookApi returns undefined', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    const authResult = await sut.execute({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
