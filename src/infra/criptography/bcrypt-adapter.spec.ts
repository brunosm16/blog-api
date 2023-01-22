import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const FAKE_HASH = 'fake_hash'

const makeSut = (salt = 12): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)

  return sut
}

jest.mock('bcrypt', () => ({
  async hash (value: string): Promise<string> {
    return await new Promise((resolve) => resolve(FAKE_HASH))
  }
}))

describe('BcryptAdapter Tests', () => {
  it('should call bcrypt-adapter with correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const fakePassword = 'loremipsum123@#'

    const sut = makeSut(12)
    await sut.hash(fakePassword)

    expect(hashSpy).toHaveBeenCalledWith(fakePassword, 12)
  })

  it('should return a hash on bcrypt-adapter success', async () => {
    const fakePassword = 'loremipsum123@#'

    const sut = makeSut(12)
    const resultHash = await sut.hash(fakePassword)

    expect(resultHash).toEqual(FAKE_HASH)
  })
})
