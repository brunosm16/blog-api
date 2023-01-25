import {
  AddPost,
  AddPostModel,
  AddPostRepository
} from './db-add-post-protocols'

export class DbAddPost implements AddPost {
  constructor (private readonly addPostRepository: AddPostRepository) {}

  async add (postData: AddPostModel): Promise<void> {
    await this.addPostRepository.add(postData)
  }
}
