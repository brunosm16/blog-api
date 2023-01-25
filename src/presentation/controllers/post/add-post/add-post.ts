import { makeOKRequest } from '../../../helpers/http/http-helper'
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

    await this.validation.validate(body)

    return makeOKRequest(body)
  }
}
