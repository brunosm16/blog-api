import { PostModel } from '../../../domain/models/post'
import { LoadPosts } from '../../../domain/usecases/load-posts'
import { LoadPostsRepository } from '../../protocols/db/post/load-posts-repository'

export class DbLoadPosts implements LoadPosts {
  constructor (private readonly loadPostsRepository: LoadPostsRepository) {}

  async load (): Promise<PostModel[]> {
    const posts = await this.loadPostsRepository.loadAll()

    return posts
  }
}
