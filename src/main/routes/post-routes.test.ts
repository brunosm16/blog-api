import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

const getFakeBody = (): any => ({
  body: {
    question: 'Lorem Ipsum',
    answers: [
      {
        image: 'fake-image.png',
        answer: 'fake_answer_1'
      },
      { answer: 'fake_answer_2' }
    ]
  }
})

const ADD_POST_URL = '/api/posts'

describe('Post Route Tests', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollectionByName('posts')

    await accountCollection.deleteMany({})
  })

  describe('POST /posts', () => {
    it('should return 403 on post without valid access token', async () => {
      const { body } = getFakeBody()
      await request(app).post(ADD_POST_URL).send(body).expect(403)
    })
  })
})
