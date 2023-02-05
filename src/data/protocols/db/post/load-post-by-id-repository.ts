import { PostModel } from '@/domain/models/post'

export interface LoadPostByIdRepository {
  loadById: (id: string) => Promise<PostModel>
}
