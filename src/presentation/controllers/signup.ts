import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { makeBadRequest, makeInternalServerError, makeOKRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const { body } = httpRequest

      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (!body[field]) {
          return makeBadRequest(new MissingParamError(field))
        }
      }

      const { email } = httpRequest.body

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return makeBadRequest(new InvalidParamError('email'))
      }

      return makeOKRequest()
    } catch (err) {
      return makeInternalServerError(new ServerError())
    }
  }
}
