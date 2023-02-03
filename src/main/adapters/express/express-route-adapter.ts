import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../../presentation/protocols'

const makeHttpRequest = (body: any): HttpRequest => ({ body })

const sendResponse = (statusCode: number, body: any, res: Response): void => {
  if (statusCode >= 200 || statusCode <= 299) {
    res.status(statusCode).json(body)
    return
  }

  res.status(statusCode).json({
    error: body?.message
  })
}

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const { statusCode, body } = await controller.handle(
      makeHttpRequest(req.body)
    )
    sendResponse(statusCode, body, res)
  }
}
