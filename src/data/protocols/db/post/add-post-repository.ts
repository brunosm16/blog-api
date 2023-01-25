import { AddPostModel } from '../../../../domain/usecases/add-post'

export interface AddPostRepository {
  add: (addPost: AddPostModel) => Promise<void>
}
