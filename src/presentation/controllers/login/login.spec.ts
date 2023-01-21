import { MissingParamError } from '../../errors'
import {
  makeBadRequest,
  makeOKRequest,
  makeUnauthorizedError
} from '../../helpers/http/http-helper'
import {
  HttpRequest,
  Validation,
  Authentication
} from '../login/login-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string | null> {
      return await new Promise((resolve) => resolve('fake_token'))
    }
  }

  return new AuthenticationStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidationStub()
  const sut = new LoginController(validationStub, authenticationStub)

  return {
    sut,
    validationStub,
    authenticationStub
  }
}

const getFakeRequest = (): HttpRequest => ({
  body: {
    email: 'loremipsum@email.com',
    password: 'loremipsum123@'
  }
})

describe('LoginController Tests', () => {
  it('should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const request = getFakeRequest()

    const { email, password } = request.body

    await sut.handle(request)

    expect(authSpy).toHaveBeenCalledWith(email, password)
  })

  it('should return 401 if user not allowed', async () => {
    const { sut, authenticationStub } = makeSut()

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const response = await sut.handle(getFakeRequest())

    expect(response).toEqual(makeUnauthorizedError())
  })

  it('should return 200 if user allowed', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(getFakeRequest())

    expect(response).toEqual(makeOKRequest({ accessToken: 'fake_token' }))
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = getFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should returns 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()

    const fakeError = new MissingParamError('fake_param_missing')

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(fakeError)

    const response = await sut.handle(getFakeRequest())

    expect(response).toEqual(makeBadRequest(fakeError))
  })
})
