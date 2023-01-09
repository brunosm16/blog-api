import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware Test', () => {
  it('should enable cors', async () => {
    const urlTest = '/cors_test'

    app.get(urlTest, (req, res) => {
      res.send()
    })

    const { header } = await request(app).get(urlTest)

    expect(header).toBeTruthy()
    expect(header.headers).toEqual('*')
    expect(header.origin).toEqual('*')
    expect(header.methods).toEqual('*')
  })
})
