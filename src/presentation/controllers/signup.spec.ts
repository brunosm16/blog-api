import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return { sut, emailValidatorStub }
}

describe('SignUpController Tests', () => {
  it('should return 400 status code if no name is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('name')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should return 400 status code if no email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        password: 'loremipsum123@#'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('email')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should return 400 status code if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('password')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should return 400 status code if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('passwordConfirm')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should return 400 if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum!',
        password: 'loremipsum123@#',
        passwordConfirm: 'loremipsum123@#'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new InvalidParamError('email')

    expect(statusCode).toEqual(400)
    expect(body).toEqual(expectedError)
  })

  it('should call emailvalidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#',
        passwordConfirm: 'loremipsum123@#'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('loremipsum@email.com')
  })

  it('should return 500 if occurs a server error', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }

    const emailValidatorStub = new EmailValidatorStub()

    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#',
        passwordConfirm: 'loremipsum123@#'
      }
    }

    const expectedError = new ServerError()

    const { statusCode, body } = sut.handle(httpRequest)

    expect(statusCode).toBe(500)
    expect(body).toEqual(expectedError)
  })
})
