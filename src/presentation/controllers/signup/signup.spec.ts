import { AddAccount, AccountModel, AddAccountModel, EmailValidator } from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      return {
        id: '1',
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { sut, emailValidatorStub, addAccountStub }
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

  it('should return 500 if email validator throws error', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

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

  it('should returns 400 if password does not match', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#',
        passwordConfirm: 'liquam eleifend mi in nulla'
      }
    }

    const expectedError = new InvalidParamError('passwordConfirm')

    const { statusCode, body } = sut.handle(httpRequest)

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should call addAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#',
        passwordConfirm: 'loremipsum123@#'
      }
    }

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'Lorem Ipsum',
      email: 'loremipsum@email.com',
      password: 'loremipsum123@#'
    })
  })

  it('should return 500 if add-account throws error', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

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
