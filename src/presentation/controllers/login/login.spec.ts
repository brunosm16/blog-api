import { InvalidParamError, MissingParamError } from '../../errors'
import { makeBadRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

const getFakeRequest = (): HttpRequest => ({
  body: {
    email: 'loremipsum@email.com',
    password: 'loremipsum123@'
  }
})

describe('LoginController Tests', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'loremipsum123@'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeBadRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'loremipsum@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      makeBadRequest(new MissingParamError('password'))
    )
  })

  it('should call email-validator with correct values', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const { email } = getFakeRequest().body

    await sut.handle(getFakeRequest())

    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  it('should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        email: 'loremipsum123@',
        password: 'loremipsum123@#'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(makeBadRequest(new InvalidParamError('email')))
  })
})
