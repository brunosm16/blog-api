import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'
import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'

const makeSut = (): LogErrorRepository => {
  return new LogMongoRepository()
}

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
    const sut = makeSut()

    await sut.logError('fake_stack_error')

    const errors = await errorCollection.countDocuments()

    expect(errors).toBe(1)
  })
})
