import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadPostById,
  makeOKRequest
} from './post-result-controller-protocols'

export class PostResultController implements Controller {
  constructor (private readonly loadPostById: LoadPostById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params } = httpRequest

    const post = await this.loadPostById.loadById(params.id)

    return makeOKRequest(post)
  }
}
