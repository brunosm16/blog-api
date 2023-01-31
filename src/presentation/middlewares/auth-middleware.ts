import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../controllers/signup/signup-controller-protocols'
import { AccessDeniedError } from '../errors'
import {
  makeForbiddenError,
  makeInternalServerError,
  makeOKRequest
} from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async getAccount (
    accessToken: string,
    role?: string
  ): Promise<AccountModel | null> {
    if (!accessToken) return null

    return await this.loadAccountByToken.load(accessToken, role)
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest?.headers?.['x-access-token']

      const account = await this.getAccount(accessToken, this?.role)

      if (account) {
        return makeOKRequest({ accountId: account.id })
      }

      const error = makeForbiddenError(new AccessDeniedError())
      return await new Promise((resolve) => resolve(error))
    } catch (err) {
      return makeInternalServerError(err)
    }
  }
}
