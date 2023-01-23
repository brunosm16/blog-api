import {
  makeBadRequest,
  makeInternalServerError,
  makeOKRequest
} from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
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

      const accountResult = await this.addAccount.add({ name, email, password })

      return makeOKRequest(accountResult)
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
