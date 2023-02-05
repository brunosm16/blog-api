import {
  Controller,
  HttpResponse,
  HttpRequest,
  makeOKRequest,
  LoadPosts
} from './load-posts-controller-protocols'

export class LoadPostsController implements Controller {
  constructor (private readonly loadPosts: LoadPosts) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const posts = await this.loadPosts.load()

    return makeOKRequest(posts)
  }
}
