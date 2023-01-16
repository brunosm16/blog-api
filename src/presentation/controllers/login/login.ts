import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import {
  makeBadRequest,
  makeInternalServerError,
  makeOKRequest
} from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!body[field]) {
          return makeBadRequest(new MissingParamError(field))
        }
      }

      const { email, password } = body

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return makeBadRequest(new InvalidParamError('email'))
      }

      await this.authentication.auth(email, password)

      return makeOKRequest({})
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
