import {
  InvalidParamError,
  makeInternalServerError
} from '../post/load-posts/load-posts-controller-protocols'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadPostById,
  makeOKRequest,
  makeForbiddenError
} from './post-result-controller-protocols'

export class PostResultController implements Controller {
  constructor (private readonly loadPostById: LoadPostById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest

      const post = await this.loadPostById.loadById(params.id)

      if (!post) {
        return makeForbiddenError(new InvalidParamError('postId'))
      }

      return makeOKRequest(post)
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
