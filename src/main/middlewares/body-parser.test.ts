import app from '../config/app'
import request from 'supertest'

describe('BodyParser Middleware Tests', () => {
  it('should parse body as json', async () => {
    const urlTest = '/parse_body_test'

    const body = {
      name: 'Lorem Ipsum'
    }

    app.post(urlTest, (req, res) => res.send(req.body))

    await request(app).post(urlTest).send(body).expect(body)
  })
})
