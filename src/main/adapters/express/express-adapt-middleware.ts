import { NextFunction, Request, Response } from 'express'
import { HttpRequest, Middleware } from '../../../presentation/protocols'

const handleSuccess = (
  req: Request,
  next: NextFunction,
  body?: object
): void => {
  Object.assign(req, body)
  next()
}

const handleError = (
  res: Response,
  statusCode: number,
  message?: string
): void => {
  res.status(statusCode).json({ error: message })
}

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }

    const { body, statusCode } = await middleware.handle(httpRequest)

    if (statusCode === 200) {
      handleSuccess(req, next, body)
    } else {
      handleError(res, statusCode, body?.message)
    }
  }
}
