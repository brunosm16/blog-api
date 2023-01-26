import { AccessDeniedError } from '../errors'
import { makeForbiddenError } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()

  return {
    sut
  }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    const expectedResponse = makeForbiddenError(new AccessDeniedError())

    expect(httpResponse).toEqual(expectedResponse)
  })
})
