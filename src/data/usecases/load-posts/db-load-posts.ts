import {
  PostModel,
  LoadPosts,
  LoadPostsRepository
} from './db-load-posts.protocols'

export class DbLoadPosts implements LoadPosts {
  constructor (private readonly loadPostsRepository: LoadPostsRepository) {}

  async load (): Promise<PostModel[]> {
    const posts = await this.loadPostsRepository.loadAll()

    return posts
  }
}
