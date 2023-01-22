import { AuthenticationModel } from '../../../domain/models/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailStub: LoadAccountByEmailRepository
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

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeLoadAccountByEmail()
  const sut = new DbAuthentication(loadAccountByEmailStub)

  return {
    sut,
    loadAccountByEmailStub
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
})
