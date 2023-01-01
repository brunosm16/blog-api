import { HttpResponse } from '../protocols/http'

export const makeBadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const makeOKRequest = (): HttpResponse => ({
  statusCode: 200,
  body: {}
})
