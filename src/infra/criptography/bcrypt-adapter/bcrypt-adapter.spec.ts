import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const FAKE_HASH = 'fake_hash'

const makeSut = (salt = 12): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)

  return sut
}

const mockBCrypt = {
  compare: async (): Promise<boolean> => {
    return await new Promise((resolve) => resolve(true))
  }
}

jest.mock('bcrypt', () => ({
  async hash (value: string): Promise<string> {
    return await new Promise((resolve) => resolve(FAKE_HASH))
  },

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return await mockBCrypt.compare()
  }
}))

describe('BcryptAdapter Tests', () => {
  describe('.hash', () => {
    it('should call hash with correct values', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      const fakePassword = 'loremipsum123@#'

      const sut = makeSut(12)
      await sut.hash(fakePassword)

      expect(hashSpy).toHaveBeenCalledWith(fakePassword, 12)
    })

    it('should return a hash on hash success', async () => {
      const fakePassword = 'loremipsum123@#'

      const sut = makeSut(12)
      const resultHash = await sut.hash(fakePassword)

      expect(resultHash).toEqual(FAKE_HASH)
    })
  })

  describe('.compare', () => {
    it('should call compare with correct values', async () => {
      const fakePassword = 'loremipsum123@#'
      const fakeHash = 'b@8gFygS63Pa'

      const compareSpy = jest.spyOn(bcrypt, 'compare')

      const sut = makeSut(12)
      await sut.compare(fakePassword, fakeHash)

      expect(compareSpy).toHaveBeenCalledWith(fakePassword, fakeHash)
    })

    it('should returns true when comparison succeeds', async () => {
      const fakePassword = 'loremipsum123@#'
      const fakeHash = 'b@8gFygS63Pa'

      const sut = makeSut(12)
      const isValid = await sut.compare(fakePassword, fakeHash)

      expect(isValid).toEqual(true)
    })

    it('should returns false when comparison fails', async () => {
      const fakePassword = 'loremipsum123@#'
      const fakeHash = 'b@8gFygS63Pa'

      const sut = makeSut(12)

      jest
        .spyOn(mockBCrypt, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

      const isValid = await sut.compare(fakePassword, fakeHash)

      expect(isValid).toEqual(false)
    })
  })
})
