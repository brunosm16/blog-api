import {
  AddAccount,
  AddAccountModel
} from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/cryptography/hasher'
import { DbAddAccount } from './db-add-account'
import { AccountModel } from './db-add-account-protocols'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'

interface SutTypes {
  sut: AddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const getFakeAccount = (): AccountModel => ({
  id: 'fake-id',
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'fake_hashed_password'
})

const getFakeAddAccount = (): AddAccountModel => ({
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'fake_hashed_password'
})

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('fake_hashed_password'))
    }
  }

  return new HasherStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (addAccount: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(getFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepositoryStub =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel | null> {
        return await new Promise((resolve) => resolve(null))
      }
    }

    return new LoadAccountByEmailRepositoryStub()
  }

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepository
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepository
  }
}

describe('DBAddAccount Tests', () => {
  it('should call hash with correct password value', async () => {
    const { sut, hasherStub } = makeSut()

    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const { password } = getFakeAddAccount()

    await sut.add(getFakeAddAccount())

    expect(hashSpy).toHaveBeenCalledWith(password)
  })

  it('should throws if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.add(getFakeAddAccount())

    await expect(promise).rejects.toThrow()
  })

  it('should throws if add-account-repository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.add(getFakeAddAccount())

    await expect(promise).rejects.toThrow()
  })

  it('should add-account-repository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(getFakeAddAccount())

    expect(addAccountRepositorySpy).toHaveBeenCalledWith(getFakeAddAccount())
  })

  it('should return account on db-account success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(getFakeAddAccount())

    expect(account).toEqual(getFakeAccount())
  })

  it('should call loadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')

    await sut.add(getFakeAccount())

    const { email } = getFakeAccount()

    expect(loadSpy).toHaveBeenCalledWith(email)
  })

  it('should return null if loadAccountByEmailRepository found email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepository, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve) => resolve(getFakeAccount())))

    const response = await sut.add(getFakeAccount())

    expect(response).toEqual(null)
  })
})
