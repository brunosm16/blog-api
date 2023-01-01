import { MissingParamError } from '../errors/missing-param-error'
import { makeBadRequest, makeOKRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest

    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

    for (const field of requiredFields) {
      if (!body[field]) {
        return makeBadRequest(new MissingParamError(field))
      }
    }

    return makeOKRequest()
  }
}