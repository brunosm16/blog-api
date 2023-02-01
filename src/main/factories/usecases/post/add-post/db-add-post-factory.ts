import { DbAddPost } from '../../../../../data/usecases/add-post/db-add-post'
import { MongoPostRepository } from '../../../../../infra/db/mongodb/post-repository/mongo-post-repository'

export const makeDbAddPost = (): DbAddPost => {
  return new DbAddPost(new MongoPostRepository())
}
