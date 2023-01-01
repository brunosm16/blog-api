import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      const responseError = {
        statusCode: 400,
        body: new Error(`Missing param: ${field}`)
      }

      const missingRequiredFiled = !body[field]

      if (missingRequiredFiled) {
        return responseError
      }
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
