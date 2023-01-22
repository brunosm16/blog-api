import { AuthenticationModel } from '../../../domain/models/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailStub: LoadAccountByEmailRepository
  updateAccessTokenStub: UpdateAccessTokenRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}

const getFakeAccount = (): AccountModel => ({
  id: 'fake-id',
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'fake_hashed_password'
})

const getFakeAuthentication = (): AuthenticationModel => ({
  email: 'lorem_ipsum@email.com',
  password: 'loremipsum123#@'
})

const makeLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel | null> {
      return await new Promise((resolve) => resolve(getFakeAccount()))
    }
  }

  return new LoadAccountByEmailStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise((resolve) => resolve('fake_token'))
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessToken = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, accessToken: string): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeLoadAccountByEmail()
  const hashComparerStub = makeHashComparer()
  const updateAccessTokenStub = makeUpdateAccessToken()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuthentication(
    loadAccountByEmailStub,
    updateAccessTokenStub,
    hashComparerStub,
    tokenGeneratorStub
  )

  return {
    sut,
    loadAccountByEmailStub,
    updateAccessTokenStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}
describe('DbAuthentication', () => {
  it('should call load-account-by-email-repository', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'load')

    await sut.auth(getFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('lorem_ipsum@email.com')
  })

  it('should returns null if load-account-by-email-repository returns null', async () => {
    const { sut, loadAccountByEmailStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const result = await sut.auth(getFakeAuthentication())

    expect(result).toEqual(null)
  })

  it('should call db-authentication with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(getFakeAuthentication())

    const { password } = getFakeAuthentication()
    const { password: hashedPassword } = getFakeAccount()

    expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword)
  })

  it('should call token-generator with correct values', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.auth(getFakeAuthentication())

    const { id } = getFakeAccount()

    expect(generateSpy).toHaveBeenCalledWith(id)
  })

  it('should return a token on success', async () => {
    const { sut } = makeSut()

    const token = await sut.auth(getFakeAccount())

    expect(token).toEqual('fake_token')
  })

  it('should call update-access-token-repository with correct values', async () => {
    const { sut, updateAccessTokenStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenStub, 'update')

    const { id } = getFakeAccount()
    await sut.auth(getFakeAccount())

    expect(updateSpy).toHaveBeenCalledWith(id, 'fake_token')
  })
})
