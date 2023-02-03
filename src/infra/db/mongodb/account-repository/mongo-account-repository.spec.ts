import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoAccountRepository } from './mongo-account-repository'

const getFakeAccount = (): AddAccountModel => ({
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'loremipsum123@#'
})

describe('MongoAccountRepository Tests', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollectionByName('accounts')

    await accountCollection.deleteMany({})
  })

  const makeSut = (): MongoAccountRepository => {
    return new MongoAccountRepository()
  }

  describe('.add', () => {
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

  describe('.load', () => {
    it('should return an account on load-by-email success', async () => {
      const sut = makeSut()

      await sut.add(getFakeAccount())

      const { name, email, password } = getFakeAccount()

      const accountResult = await sut.loadByEmail(email)

      expect(accountResult).toBeTruthy()
      expect(accountResult?.id).toBeTruthy()
      expect(accountResult?.name).toEqual(name)
      expect(accountResult?.email).toEqual(email)
      expect(accountResult?.password).toEqual(password)
    })

    it('should return null if on load-by-email fails', async () => {
      const sut = makeSut()

      const accountResult = await sut.loadByEmail(
        'non-existent-email@email.com'
      )

      expect(accountResult).toBeFalsy()
    })
  })

  describe('.updateAccessToken', () => {
    it('should update accessToken on updateAccessToken success', async () => {
      const sut = makeSut()

      let accountResult

      const inserted = await accountCollection.insertOne(getFakeAccount())

      accountResult = inserted.ops[0]
      expect(accountResult.accessToken).toBeFalsy()

      await sut.updateAccessToken(accountResult._id, 'fake_token')

      accountResult = await accountCollection.findOne({
        _id: accountResult._id
      })

      expect(accountResult).toBeTruthy()
      expect(accountResult.accessToken).toEqual('fake_token')
    })
  })

  describe('.loadByToken', () => {
    it('should return an account by accessToken', async () => {
      const sut = makeSut()

      const payload = { ...getFakeAccount(), accessToken: 'fake_token' }

      await accountCollection.insertOne(payload)

      const resultAccount = await sut.loadByToken('fake_token')

      expect(resultAccount).toBeTruthy()
      expect(resultAccount?.id).toBeTruthy()
      expect(resultAccount?.name).toEqual('lorem-ipsum')
      expect(resultAccount?.email).toEqual('loremipsum@email.com')
      expect(resultAccount?.password).toEqual('loremipsum123@#')
    })

    it('should return null if load-by-token fails', async () => {
      const sut = makeSut()

      const resultAccount = await sut.loadByToken('fake_token')

      expect(resultAccount).toEqual(null)
    })

    it('should return an account on load-by-token when role is provided', async () => {
      const sut = makeSut()

      const payload = { ...getFakeAccount(), accessToken: 'fake_token', role: 'fake_role' }

      await accountCollection.insertOne(payload)

      const resultAccount = await sut.loadByToken('fake_token', 'fake_role')

      expect(resultAccount).toBeTruthy()
      expect(resultAccount?.id).toBeTruthy()
      expect(resultAccount?.name).toEqual('lorem-ipsum')
      expect(resultAccount?.email).toEqual('loremipsum@email.com')
      expect(resultAccount?.password).toEqual('loremipsum123@#')
    })
  })
})
