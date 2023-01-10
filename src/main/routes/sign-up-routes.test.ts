import request from 'supertest'
import app from '../config/app'

const SIGN_UP_URL = '/api/signup'

describe('SignUp Route Tests', () => {
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
