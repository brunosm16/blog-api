import { MongoHelper } from '../helpers/mongo-helper'
import { MongoAccountRepository } from './mongo-account-repository'

describe('MongoAccountRepository Tests', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollectionByName('accounts')

    await accountCollection.deleteMany({})
  })

  it('should return a account when insert is successful', async () => {
    const sut = new MongoAccountRepository()

    const fakeAccount = {
      id: 'fake-id',
      name: 'lorem-ipsum',
      email: 'loremipsum@email.com',
      password: 'loremipsum123@#'
    }

    const accountResult = await sut.add(fakeAccount)

    expect(accountResult).toBeTruthy()
    expect(accountResult.id).toBeTruthy()
    expect(accountResult.name).toEqual(fakeAccount.name)
    expect(accountResult.email).toEqual(fakeAccount.email)
    expect(accountResult.password).toEqual(fakeAccount.password)
  })
})
