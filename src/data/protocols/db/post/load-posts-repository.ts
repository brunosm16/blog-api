import { PostModel } from '../../../../domain/models/post'

export interface LoadPostsRepository {
  loadAll: () => Promise<PostModel[]>
}
