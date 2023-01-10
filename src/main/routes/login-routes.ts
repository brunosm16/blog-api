import { Express } from 'express'

export default (app: Express): void => {
  app.post('/login', (req, res) => {
    res.json({ ok: 'ok' })
  })
}
