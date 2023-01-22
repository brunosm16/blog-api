import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (value: string, secret: string): Promise<string> {
    return await new Promise((resolve) => resolve('fake_token'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('fake_secret')
}

describe('JwtAdapter', () => {
  it('should call sign with correct values', async () => {
    const sut = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('fake_password')

    expect(signSpy).toHaveBeenCalledWith({ id: 'fake_password' }, 'fake_secret')
  })
})
