import {
  AddPostModel,
  AddPostRepository
} from '../../../../data/usecases/add-post/db-add-post-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoPostRepository implements AddPostRepository {
  async add (postData: AddPostModel): Promise<void> {
    const postsCollection = await MongoHelper.getCollectionByName('posts')

    await postsCollection.insertOne(postData)
  }
}
