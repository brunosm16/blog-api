import { ServerError, UnauthorizedError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const makeBadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const makeOKRequest = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const makeInternalServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error?.stack)
})

export const makeUnauthorizedError = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
