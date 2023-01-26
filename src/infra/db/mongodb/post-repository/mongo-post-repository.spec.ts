import { Collection } from 'mongodb'
import { AddPostModel } from '../../../../domain/usecases/add-post'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoPostRepository } from './mongo-post-repository'

interface SutTypes {
  sut: MongoPostRepository
}

const getFakePost = (): AddPostModel => ({
  question: 'fake_question',
  answers: [
    {
      image: 'fake_image',
      answer: 'fake_answer'
    }
  ]
})

const makeSut = (): SutTypes => {
  return {
    sut: new MongoPostRepository()
  }
}

describe('MongoPostRepository', () => {
  let postCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    postCollection = await MongoHelper.getCollectionByName('posts')

    await postCollection.deleteMany({})
  })

  it('should add a new post on add-post success', async () => {
    const { sut } = makeSut()

    await sut.add(getFakePost())

    const result = await postCollection.findOne({ question: 'fake_question' })

    expect(result).toBeTruthy()
  })
})