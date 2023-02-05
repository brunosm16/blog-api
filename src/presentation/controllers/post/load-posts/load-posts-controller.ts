import {
  Controller,
  HttpResponse,
  HttpRequest,
  makeOKRequest,
  LoadPosts,
  makeInternalServerError,
  makeNoContentRequest
} from './load-posts-controller-protocols'

export class LoadPostsController implements Controller {
  constructor (private readonly loadPosts: LoadPosts) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const posts = await this.loadPosts.load()

      if (!posts.length) return makeNoContentRequest()

      return makeOKRequest(posts)
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
