import { Collection } from 'mongodb'
import MockDate from 'mockdate'
import { AddPostModel } from '../../../../domain/usecases/add-post'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoPostRepository } from './mongo-post-repository'

interface SutTypes {
  sut: MongoPostRepository
}

const getFakePosts = (): AddPostModel[] => [
  {
    question: 'fake_question',
    answers: [
      {
        image: 'fake_image',
        answer: 'fake_answer'
      }
    ],
    date: new Date()
  },
  {
    question: 'fake_question_2',
    answers: [
      {
        image: 'fake_image_2',
        answer: 'fake_answer_2'
      }
    ],
    date: new Date()
  }
]

const makeSut = (): SutTypes => {
  return {
    sut: new MongoPostRepository()
  }
}

describe('MongoPostRepository', () => {
  let postCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    postCollection = await MongoHelper.getCollectionByName('posts')

    await postCollection.deleteMany({})
  })

  describe('.add', () => {
    it('should add a new post on add-post success', async () => {
      const { sut } = makeSut()

      const post = getFakePosts()

      await sut.add(post[0])

      const result = await postCollection.findOne({ question: 'fake_question' })

      expect(result).toBeTruthy()
    })
  })

  describe('.load', () => {
    it('should return posts on loadAll success', async () => {
      const { sut } = makeSut()

      await postCollection.insertMany(getFakePosts())

      const posts = await sut.loadAll()

      expect(posts.length).toEqual(2)
      expect(posts[0].question).toEqual('fake_question')
      expect(posts[1].question).toEqual('fake_question_2')
    })
  })
})
