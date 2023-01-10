import express from 'express'
import setMiddlewares from './set-middlewares'
import setRoutes from './set-routes'

const app = express()

setMiddlewares(app)
setRoutes(app)

export default app
