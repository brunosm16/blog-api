import {
  Controller,
  HttpResponse,
  HttpRequest,
  makeOKRequest,
  LoadPosts,
  makeInternalServerError
} from './load-posts-controller-protocols'

export class LoadPostsController implements Controller {
  constructor (private readonly loadPosts: LoadPosts) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const posts = await this.loadPosts.load()

      return makeOKRequest(posts)
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
