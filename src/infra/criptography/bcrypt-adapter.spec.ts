import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const makeSut = (salt = 12): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)

  return sut
}

describe('BcryptAdapter Tests', () => {
  it('should call bcrypt-adapter with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const fakePassword = 'loremipsum123@#'

    const sut = makeSut(12)
    await sut.encrypt(fakePassword)

    expect(hashSpy).toHaveBeenCalledWith(fakePassword, 12)
  })
})
