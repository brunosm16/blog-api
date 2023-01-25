import {
  makeBadRequest,
  makeOKRequest
} from '../../../helpers/http/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Validation
} from '../../login/login-controller-protocols'
import { Controller } from './add-post-protocols'

export class AddPost implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    const error = await this.validation.validate(body)

    if (error) {
      return makeBadRequest(new Error())
    }

    return makeOKRequest(body)
  }
}
