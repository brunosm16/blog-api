import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { makeBadRequest, makeInternalServerError, makeOKRequest } from '../../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
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

      const { name, email, password, passwordConfirm } = httpRequest.body

      const invalidPasswords = password !== passwordConfirm

      if (invalidPasswords) {
        return makeBadRequest(new InvalidParamError('passwordConfirm'))
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return makeBadRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({ name, email, password })

      return makeOKRequest()
    } catch (err) {
      return makeInternalServerError(new ServerError())
    }
  }
}