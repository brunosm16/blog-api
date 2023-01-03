import { AddAccount } from '../../domain/usecases/add-account'
import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: AddAccount
  encrypterStub: Encrypter
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('fake_hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
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
})
