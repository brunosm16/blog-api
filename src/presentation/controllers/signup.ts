import { MissingParamError } from '../errors/missing-param-error'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      const responseError = {
        statusCode: 400,
        body: new MissingParamError(field)
      }

      if (!body[field]) {
        return responseError
      }
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
