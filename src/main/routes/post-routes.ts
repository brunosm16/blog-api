/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddPostController } from '../factories/controllers/post/add-post/add-post-factory'
import { makeLoadPostController } from '../factories/controllers/post/load-post/load-post-factory'
import { adminAuth, auth } from '../middlewares/authentication'

export default (router: Router): void => {
  router.post('/posts', adminAuth, adaptRoute(makeAddPostController()))
  router.get('/posts', auth, adaptRoute(makeLoadPostController()))
}
