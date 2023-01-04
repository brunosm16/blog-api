import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { AddAccountRepository } from '../protocols/add-account-repository-'
import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'
import { AccountModel } from './db-add-account-protocols'

interface SutTypes {
  sut: AddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('fake_hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (addAccount: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'fake-id',
        name: 'lorem-ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DBAddAccount Tests', () => {
  it('should call encrypter with correct password value', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const fakeAccount = {
      name: 'lorem-ipsum',
      email: 'loremipsum@email.com',
      password: 'loremipsum123@#'
    }

    await sut.add(fakeAccount)

    expect(encryptSpy).toHaveBeenCalledWith(fakeAccount.password)
  })

  it('should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const fakeAccount = {
      name: 'lorem-ipsum',
      email: 'loremipsum@email.com',
      password: 'loremipsum123@#'
    }

    const promise = sut.add(fakeAccount)

    await expect(promise).rejects.toThrow()
  })

  it('should add-account-repository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const fakeAccount = {
      name: 'lorem-ipsum',
      email: 'loremipsum@email.com',
      password: 'loremipsum123@#'
    }

    await sut.add(fakeAccount)

    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      ...fakeAccount,
      password: 'fake_hashed_password'
    })
  })
})
