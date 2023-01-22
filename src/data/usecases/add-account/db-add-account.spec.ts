import {
  AddAccount,
  AddAccountModel
} from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'
import { Hasher } from '../../protocols/cryptography/hasher'
import { DbAddAccount } from './db-add-account'
import { AccountModel } from './db-add-account-protocols'

interface SutTypes {
  sut: AddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('fake_hashed_password'))
    }
  }

  return new HasherStub()
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

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (addAccount: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(getFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
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
})
