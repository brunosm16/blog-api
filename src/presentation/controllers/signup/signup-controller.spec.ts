import {
  AddAccount,
  AccountModel,
  AddAccountModel,
  HttpRequest
} from './signup-controller-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup-controller'
import {
  makeBadRequest,
  makeInternalServerError,
  makeOKRequest
} from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { Authentication } from '../login/login-controller-protocols'
import { AuthenticationModel } from '../../../domain/models/authentication'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const getFakeAccount = (): AccountModel => ({
  id: 'lorem_ipsum_id',
  name: 'Lorem Ipsum',
  email: 'loremipsum@email.com',
  password: 'loremipsum123@#'
})

const getFakeRequest = (): HttpRequest => ({
  body: {
    name: 'Lorem Ipsum',
    email: 'loremipsum@email.com',
    password: 'loremipsum123@#',
    passwordConfirm: 'loremipsum123@#'
  }
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const mockAccount = {
        id: 'lorem_ipsum_id',
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }

      return await new Promise((resolve) => resolve(mockAccount))
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string | null> {
      return await new Promise((resolve) => resolve('fake_token'))
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )

  return { sut, addAccountStub, validationStub, authenticationStub }
}

describe('SignUpController Tests', () => {
  it('should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(getFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'Lorem Ipsum',
      email: 'loremipsum@email.com',
      password: 'loremipsum123@#'
    })
  })

  it('should return 500 if add-account throws error', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(getFakeRequest())

    expect(httpResponse).toEqual(makeInternalServerError(new ServerError()))
  })

  it('should return 200 if valid body passed to add-account', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(getFakeRequest())
    expect(httpResponse).toEqual(makeOKRequest(getFakeAccount()))
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

  it('should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(getFakeRequest())

    const { email, password } = getFakeRequest().body

    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })
})
