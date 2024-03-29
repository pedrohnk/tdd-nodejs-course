import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type TokenGenerator } from '@/data/contracts/cryptography'
import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

import { mocked } from 'jest-mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('Facebook Authentication Service', () => {
  let token: string
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let cryptography: MockProxy<TokenGenerator>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService

  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    cryptography = mock()
    cryptography.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
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

  it('should call LoadUserAccountRepository when LoadFacebokoUserApi returns data', async () => {
    await sut.execute({ token })
    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)
    await sut.execute({ token })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut.execute({ token })
    expect(cryptography.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMiliseconds: AccessToken.expirationInMilliseconds
    })
    expect(cryptography.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.execute({ token })
    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut.execute({ token })
    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_user_error'))
    const promise = sut.execute({ token })
    await expect(promise).rejects.toThrow(new Error('load_user_error'))
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_user_error'))
    const promise = sut.execute({ token })
    await expect(promise).rejects.toThrow(new Error('save_user_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    cryptography.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.execute({ token })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
