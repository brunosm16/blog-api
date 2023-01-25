import { AddPost } from '../../../../domain/usecases/add-post'
import {
  makeBadRequest,
  makeInternalServerError,
  makeNoContentRequest
} from '../../../helpers/http/http-helper'
import {
  HttpRequest,
  HttpResponse,
  Validation
} from '../../login/login-controller-protocols'
import { Controller } from './add-post-controller-protocols'

export class AddPostController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addPost: AddPost
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const error = this.validation.validate(body)

      if (error) {
        return makeBadRequest(new Error())
      }

      const { question, answers } = body

      await this.addPost.add({ question, answers })

      return makeNoContentRequest()
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
