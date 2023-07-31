import { JwtTokenGenerator } from '@/infra/cryptography'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>
  let key: string
  let expirationInMiliseconds: number

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
    key = 'any_key'
    expirationInMiliseconds = 1000
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  it('should call sign with correct params ', async () => {
    await sut.generateToken({ key, expirationInMiliseconds })
    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, 'any_secret', { expiresIn: 1 })
  })

  it('should return a token ', async () => {
    const token = await sut.generateToken({ key, expirationInMiliseconds })
    expect(token).toBe('any_token')
  })

  it('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

    const promise = sut.generateToken({ key, expirationInMiliseconds })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
