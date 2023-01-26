/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeAddPostController } from '../factories/controllers/post/add-post-factory'

export default (router: Router): void => {
  router.post('/posts', adaptRoute(makeAddPostController()))
}
