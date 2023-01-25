import { AddPostModel } from '../../../../domain/usecases/add-post'

export interface AddPostRepository {
  add: (postData: AddPostModel) => Promise<void>
}
