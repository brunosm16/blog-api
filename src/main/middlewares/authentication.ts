import { adaptMiddleware } from '../adapters/express/express-adapt-middleware'
import { makeAuthMiddleware } from '../factories/middlewares/auth/auth-middleware-factory'

export const auth = adaptMiddleware(makeAuthMiddleware())
export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
