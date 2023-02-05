import { Collection } from 'mongodb'
import {
  PostResultModel,
  SavePostResultModel,
  SavePostResultRepository
} from '@/data/usecases/save-post-result/db-save-post-result-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoPostResultRepository implements SavePostResultRepository {
  async getPostsResultsCollection (): Collection {
    const collection = await MongoHelper.getCollectionByName('postResults')

    return collection
  }

  async save (data: SavePostResultModel): Promise<PostResultModel> {
    const postResultsCollection = await this.getPostsResultsCollection()

    const { postId, accountId, answer, date } = data

    const res = await postResultsCollection.findOneAndUpdate(
      {
        postId,
        accountId
      },
      {
        $set: {
          answer,
          date
        }
      },
      {
        upsert: true,
        returnOriginal: false
      }
    )

    return res?.value && MongoHelper.map(res?.value)
  }
}
