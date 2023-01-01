import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { makeBadRequest, makeInternalServerError, makeOKRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'

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

      const { email, password, passwordConfirm } = httpRequest.body

      const invalidPasswords = password !== passwordConfirm

      if (invalidPasswords) {
        return makeBadRequest(new InvalidParamError('passwordConfirm'))
      }

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
