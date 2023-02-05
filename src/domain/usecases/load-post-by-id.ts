import { PostModel } from '@/domain/models/post'

export interface LoadPostById {
  loadById: (id: string) => Promise<PostModel>
}
