import { AccessDeniedError } from '../errors'
import {
  makeForbiddenError,
  makeInternalServerError,
  makeOKRequest
} from '../helpers/http/http-helper'
import {
  HttpRequest,
  AccountModel,
  LoadAccountByToken
} from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeAccount = (): AccountModel => ({
  id: 'fake-id',
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'fake_hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'fake_token'
  }
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenStub()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    const expectedResponse = makeForbiddenError(new AccessDeniedError())

    expect(httpResponse).toEqual(expectedResponse)
  })

  it('should call load-account-by-token with correct token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('fake_token', undefined)
  })

  it('should return 403 if load-account-by-token returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const response = await sut.handle({})

    expect(response).toEqual(makeForbiddenError(new AccessDeniedError()))
  })

  it('should return 200 if load-account-by-token succeeds', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(makeOKRequest({ accountId: 'fake-id' }))
  })

  it('should return 500 if load-account-by-token throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(makeFakeRequest())

    expect(response).toEqual(makeInternalServerError(new Error()))
  })

  it('should call load-account-by-token with token', async () => {
    const role = 'fake_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('fake_token', role)
  })
})
