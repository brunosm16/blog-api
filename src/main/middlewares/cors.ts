import { Request, Response, NextFunction } from 'express'

const accesses = {
  origin: 'access-control-allow-origin',
  headers: 'access-control-allow-headers',
  methods: 'access-control-allow-methods'
}

const setCorsAccess = (res: Response, accessesObj: object): void => {
  Object.keys(accessesObj).forEach((key) => res.set(key, '*'))
}

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  setCorsAccess(res, accesses)
  next()
}
