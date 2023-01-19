import { InvalidParamError } from '../../errors'
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

      const error = this.validation.validate(body)

      if (error) {
        return makeBadRequest(error)
      }

      const { name, email, password } = body

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
