import { PostModel } from '../models/post'

export interface LoadPosts {
  load: () => Promise<PostModel[]>
}
