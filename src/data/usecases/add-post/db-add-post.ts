import {
  AddPost,
  AddPostModel,
  AddPostRepository
} from './db-add-post-protocols'

export class DbAddPost implements AddPost {
  constructor (private readonly addPostRepository: AddPostRepository) {}

  async add (addPost: AddPostModel): Promise<void> {
    await this.addPostRepository.add(addPost)
  }
}
