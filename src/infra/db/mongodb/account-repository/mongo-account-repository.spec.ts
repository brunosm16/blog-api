import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoAccountRepository } from './mongo-account-repository'

const getFakeAccount = (): AddAccountModel => ({
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'loremipsum123@#'
})

describe('MongoAccountRepository Tests', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollectionByName('accounts')

    await accountCollection.deleteMany({})
  })

  const makeSut = (): MongoAccountRepository => {
    return new MongoAccountRepository()
  }

  it('should return a account when insert is successful', async () => {
    const sut = makeSut()

    const accountResult = await sut.add(getFakeAccount())

    const { name, email, password } = getFakeAccount()

    expect(accountResult).toBeTruthy()
    expect(accountResult.id).toBeTruthy()
    expect(accountResult.name).toEqual(name)
    expect(accountResult.email).toEqual(email)
    expect(accountResult.password).toEqual(password)
  })
})
