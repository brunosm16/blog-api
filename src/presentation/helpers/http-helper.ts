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
  body: error
})
