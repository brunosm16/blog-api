import { MissingParamError } from '../../errors'
import { makeBadRequest, makeOKRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!body[field]) {
        return makeBadRequest(new MissingParamError(field))
      }
    }

    return makeOKRequest({})
  }
}
