import fg from 'fast-glob'
import { Express, Router } from 'express'

const ROUTES_FILES_DIR = '**/src/main/routes/**routes.ts'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  fg.sync(ROUTES_FILES_DIR).map(async (file) =>
    (await import(`../../../${file}`)).default(router)
  )
}
