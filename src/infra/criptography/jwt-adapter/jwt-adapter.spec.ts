import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (value: string, secret: string): Promise<string> {
    return await new Promise((resolve) => resolve('fake_token'))
  },

  async verify (value: string, secret: string): Promise<string> {
    return await new Promise((resolve) => resolve('fake_value'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('fake_secret')
}

describe('JwtAdapter', () => {
  describe('.sign', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut()

      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('fake_password')

      expect(signSpy).toHaveBeenCalledWith(
        { id: 'fake_password' },
        'fake_secret'
      )
    })

    it('should return a accessToken on sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt('fake_password')

      expect(accessToken).toEqual('fake_token')
    })
  })

  describe('.verify', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()

      const verifySpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('fake_token')

      expect(verifySpy).toHaveBeenCalledWith('fake_token', 'fake_secret')
    })
  })
})
