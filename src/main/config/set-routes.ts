import { readdirSync } from 'fs'
import { Express, Router } from 'express'
import path from 'path'

const ROUTES_FILES_DIR = path.join(__dirname, '..', 'routes')

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  readdirSync(ROUTES_FILES_DIR).map(async (file) => {
    if (!file.includes('.test.') || !file.includes('.map.')) {
      ;(await import(`../routes/${file}`)).default(router)
    }
  })
}
