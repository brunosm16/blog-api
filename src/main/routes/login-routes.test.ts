import request from 'supertest'
import { Collection } from 'mongodb'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { hash } from 'bcrypt'

const API_PREFIX = '/api'

const SIGN_UP_URL = `${API_PREFIX}/signup`
const LOGIN_URL = `${API_PREFIX}/login`

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
      await request(app).post(SIGN_UP_URL).send(body).expect(403)
    })

    it('should return statusCode 403 on email already in use', async () => {
      const body = {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremispum123@#',
        passwordConfirm: 'loremispum123@#'
      }

      await request(app).post(SIGN_UP_URL).send(body).expect(200)
      await request(app).post(SIGN_UP_URL).send(body).expect(403)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on successful login', async () => {
      const password = await hash('fake_password', 12)

      await accountCollection.insertOne({
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password
      })

      await request(app)
        .post(LOGIN_URL)
        .send({
          email: 'loremipsum@email.com',
          password: 'fake_password'
        })
        .expect(200)
    })

    it('should return 400 on unauthorized login', async () => {
      await request(app)
        .post(LOGIN_URL)
        .send({
          email: 'loremipsum@email.com',
          password: 'fake_password'
        })
        .expect(401)
    })
  })
})
