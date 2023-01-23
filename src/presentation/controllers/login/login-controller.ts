import {
  makeBadRequest,
  makeInternalServerError,
  makeOKRequest,
  makeUnauthorizedError
} from '../../helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  Authentication
} from './login-controller-protocols'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (validation: Validation, authentication: Authentication) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { email, password } = body

      const error = this.validation.validate(body)

      if (error) {
        return makeBadRequest(error)
      }

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return makeUnauthorizedError()
      }

      return makeOKRequest({ accessToken })
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
