import { AuthenticationModel } from '../../../domain/models/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
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

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeLoadAccountByEmail()
  const hashComparerStub = makeHashComparer()
  const sut = new DbAuthentication(loadAccountByEmailStub, hashComparerStub)

  return {
    sut,
    loadAccountByEmailStub,
    hashComparerStub
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
})
