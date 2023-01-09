import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  it('should return json as default content type', async () => {
    const urlTest = '/content-type_test_json'

    app.get(urlTest, (req, res) => {
      res.send('')
    })

    await request(app).get(urlTest).expect('content-type', /json/)
  })

  it('should return xml as content type', async () => {
    const urlTest = '/content-type_test_xml'

    app.get(urlTest, (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app).get(urlTest).expect('content-type', /xml/)
  })
})
