import { MissingParamError, InvalidParamError } from '../../errors'
import {
  makeBadRequest,
  makeInternalServerError,
  makeOKRequest
} from '../../helpers/http-helper'
import { Validation } from '../../helpers/validation'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount
} from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      this.validation.validate(body)

      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

      for (const field of requiredFields) {
        if (!body[field]) {
          return makeBadRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirm } = body

      const invalidPasswords = password !== passwordConfirm

      if (invalidPasswords) {
        return makeBadRequest(new InvalidParamError('passwordConfirm'))
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return makeBadRequest(new InvalidParamError('email'))
      }

      const accountResult = await this.addAccount.add({ name, email, password })

      return makeOKRequest(accountResult)
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
