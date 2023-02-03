import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

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
  let postsCollection: Collection
  let accountsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    postsCollection = await MongoHelper.getCollectionByName('posts')
    accountsCollection = await MongoHelper.getCollectionByName('accounts')

    await postsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  describe('POST /posts', () => {
    it('should return 403 on post without valid access token', async () => {
      const { body } = getFakeBody()
      await request(app).post(ADD_POST_URL).send(body).expect(403)
    })

    it('should return 204 on add-post success', async () => {
      const { body } = getFakeBody()

      const user = {
        name: 'lorem-ipsum',
        email: 'loremipsum@email.com',
        password: 'fake_hashed_password',
        role: 'admin',
        accessToken: 'fake_token'
      }

      const result = await accountsCollection.insertOne({ user })
      const id = result.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)

      await accountsCollection.updateOne(
        { _id: id },
        {
          $set: {
            accessToken
          }
        }
      )

      await request(app)
        .post(ADD_POST_URL)
        .set('x-access-token', accessToken)
        .send(body)
        .expect(204)
    })
  })
})
