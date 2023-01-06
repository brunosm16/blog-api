import express from 'express'
import setMiddlewares from './set-middlewares'

const app = express()

setMiddlewares(app)

export default app
