import { DbLoadAccountByToken } from './db-load-account-by-token'

import {
  LoadAccountByTokenRepository,
  Decrypter,
  AccountModel
} from './db-load-account-by-token-protocols'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const getFakeAccessToken = (): string => 'fake_access_token'

const getFakeAccount = (): AccountModel => ({
  id: 'fake-id',
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'fake_hashed_password'
})

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('fake_decrypted_token'))
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByTokenRepositoryStub =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
      async loadByToken (
        token: string,
        role?: string
      ): Promise<AccountModel | null> {
        return await new Promise((resolve) => resolve(getFakeAccount()))
      }
    }

    return new LoadAccountByTokenRepositoryStub()
  }

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub =
    makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken', () => {
  it('should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load(getFakeAccessToken())

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

  it('should call load-account-by-token-repository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    )

    await sut.load(getFakeAccessToken())

    expect(loadByTokenSpy).toHaveBeenCalledWith('fake_decrypted_token')
  })

  it('should return null if load-account-by-token-repository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const response = await sut.load(getFakeAccessToken())

    expect(response).toEqual(null)
  })

  it('should return account if load-account-by-token-repository succeeds', async () => {
    const { sut } = makeSut()

    const response = await sut.load(getFakeAccessToken())

    expect(response).toEqual(getFakeAccount())
  })
})
