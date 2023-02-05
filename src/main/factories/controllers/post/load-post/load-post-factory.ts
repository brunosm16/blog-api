import { LoadPostsController } from '../../../../../presentation/controllers/post/load-posts/load-posts-controller'
import { makeDbLoadPosts } from '../../../usecases/post/load-posts/db-load-post-factory'

export const makeLoadPostController = (): LoadPostsController => {
  return new LoadPostsController(makeDbLoadPosts())
}
