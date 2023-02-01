import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from './db-load-account-by-token-protocols'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('fake_decrypted_token'))
    }
  }

  return new DecrypterStub()
}

const getFakeAccessToken = (): string => 'fake_access_token'

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)

  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadAccountByToken', () => {
  it('should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('fake_access_token')

    expect(decryptSpy).toHaveBeenCalledWith('fake_access_token')
  })

  it('should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const response = await sut.load(getFakeAccessToken())

    expect(response).toEqual(null)
  })
})
