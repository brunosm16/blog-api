import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { makeForbiddenError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }

    const error = makeForbiddenError(new AccessDeniedError())
    return await new Promise((resolve) => resolve(error))
  }
}
