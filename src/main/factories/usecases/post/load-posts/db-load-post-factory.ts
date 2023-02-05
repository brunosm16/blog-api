import { DbLoadPosts } from '../../../../../data/usecases/load-posts/db-load-posts'
import { MongoPostRepository } from '../../../../../infra/db/mongodb/post-repository/mongo-post-repository'

export const makeDbLoadPosts = (): DbLoadPosts => {
  return new DbLoadPosts(new MongoPostRepository())
}
