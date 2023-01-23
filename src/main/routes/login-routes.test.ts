import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

const SIGN_UP_URL = '/api/signup'

describe('Login Route Tests', () => {
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

  describe('POST /signup', () => {
    it('should return statusCode 200 on success', async () => {
      const body = {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremispum123@#',
        passwordConfirm: 'loremispum123@#'
      }

      await request(app).post(SIGN_UP_URL).send(body).expect(200)
    })
  })
})
