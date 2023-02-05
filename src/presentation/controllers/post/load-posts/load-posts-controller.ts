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
    await this.loadPosts.load()

    return await new Promise((resolve) => resolve(makeOKRequest({})))
  }
}
