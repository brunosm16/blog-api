import { AddPostController } from '../../../../../presentation/controllers/post/add-post/add-post-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeDbAddPost } from '../../../usecases/post/add-post/db-add-post-factory'
import { makeAddPostValidation } from './add-post-validation'

export const makeAddPostController = (): Controller => {
  const addPostController = new AddPostController(
    makeAddPostValidation(),
    makeDbAddPost()
  )
  return makeLogControllerDecorator(addPostController)
}
