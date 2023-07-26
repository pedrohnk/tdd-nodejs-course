import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type TokenGenerator } from '@/data/contracts/cryptography'
import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

import { mocked } from 'jest-mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('Facebook Authentication Service', () => {
  const token = 'any_token'
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let cryptography: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService

  beforeEach(() => {
    facebookApi = mock()
    userAccountRepo = mock()
    cryptography = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValueOnce({ id: 'any_account_id' })
    facebookApi.loadUser.mockResolvedValueOnce({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      cryptography
    )
  })

  it('should call LoadUserFacebookApi with correct parameters', async () => {
    await sut.execute({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return authentication error when LoadUserFacebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.execute({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebokoUserApi returns data', async () => {
    await sut.execute({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('sshould call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.execute({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('sshould call TokenGenerator with correct params', async () => {
    await sut.execute({ token })

    expect(cryptography.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMiliseconds: AccessToken.expirationInMilliseconds
    })
    expect(cryptography.generateToken).toHaveBeenCalledTimes(1)
  })
})
