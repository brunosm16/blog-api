import {
  InvalidParamError,
  makeInternalServerError,
  PostModel
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

  validateAnswer (post: PostModel | null, answer: string | null): Error | null {
    if (!post) {
      return new InvalidParamError('postId')
    }

    const answers = post.answers.map(({ answer }) => answer)

    if (!answer || !answers.includes(answer)) {
      return new InvalidParamError('answer')
    }

    return null
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params, body } = httpRequest

      const post = await this.loadPostById.loadById(params.id)

      const error = this.validateAnswer(post, body?.answer)

      if (error) {
        return makeForbiddenError(error)
      }

      return makeOKRequest(post)
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
