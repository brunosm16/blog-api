import { LoadPostByIdRepository } from '@/data/protocols/db/post/load-post-by-id-repository'
import { PostModel } from '@/domain/models/post'
import { LoadPostById } from '@/domain/usecases/load-post-by-id'

export class DbLoadPostById implements LoadPostById {
  constructor (
    private readonly loadPostByIdRepository: LoadPostByIdRepository
  ) {}

  async loadById (id: string): Promise<PostModel> {
    const post = await this.loadPostByIdRepository.loadById(id)
    return post
  }
}
