import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

describe('LogMongoRepository Tests', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollectionByName('errors')

    await errorCollection.deleteMany({})
  })

  it('should inserts a error log', async () => {
    const sut = new LogMongoRepository()

    await sut.logError('fake_stack_error')

    const errors = await errorCollection.countDocuments()

    expect(errors).toEqual(1)
  })
})
