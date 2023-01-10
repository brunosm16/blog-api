import { Express } from 'express'

export default (app: Express): void => {
  app.post('/signup', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
