import { LoadPostByIdRepository } from '@/data/usecases/load-post-by-id/db-load-post-by-id-protocols'
import { Collection } from 'mongodb'
import { LoadPostsRepository } from '@/data/protocols/db/post/load-posts-repository'
import {
  AddPostModel,
  AddPostRepository
} from '@/data/usecases/add-post/db-add-post-protocols'
import { PostModel } from '@/domain/models/post'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class MongoPostRepository
implements AddPostRepository, LoadPostsRepository, LoadPostByIdRepository {
  async getPostsCollection (): Collection {
    const postsCollection = await MongoHelper.getCollectionByName('posts')

    return postsCollection
  }

  async add (postData: AddPostModel): Promise<void> {
    const postsCollection = await this.getPostsCollection()

    await postsCollection.insertOne(postData)
  }

  async loadAll (): Promise<PostModel[]> {
    const postsCollection = await this.getPostsCollection()

    const posts = await postsCollection.find().toArray()

    return posts
  }

  async loadById (id: string): Promise<PostModel> {
    const postsCollection = await this.getPostsCollection()

    const post = await postsCollection.findOne({ _id: id })

    return post
  }
}
