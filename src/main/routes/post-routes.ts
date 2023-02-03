/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express/express-adapt-middleware'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddPostController } from '../factories/controllers/post/add-post/add-post-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))

  router.post('/posts', adminAuth, adaptRoute(makeAddPostController()))
}
