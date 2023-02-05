import {
  LoadPostByIdRepository,
  PostModel,
  LoadPostById
} from './db-load-post-by-id-protocols'

export class DbLoadPostById implements LoadPostById {
  constructor (
    private readonly loadPostByIdRepository: LoadPostByIdRepository
  ) {}

  async loadById (id: string): Promise<PostModel> {
    const post = await this.loadPostByIdRepository.loadById(id)
    return post
  }
}
