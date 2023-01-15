import {
  AddAccount,
  AccountModel,
  AddAccountModel,
  EmailValidator,
  HttpRequest
} from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'
import {
  makeBadRequest,
  makeInternalServerError,
  makeOKRequest
} from '../../helpers/http-helper'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return { sut, emailValidatorStub, addAccountStub }
}

describe('SignUpController Tests', () => {
  it('should return 400 status code if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeBadRequest(new MissingParamError('name')))
  })

  it('should return 400 status code if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        password: 'loremipsum123@#'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeBadRequest(new MissingParamError('email')))
  })

  it('should return 400 status code if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      makeBadRequest(new MissingParamError('password'))
    )
  })

  it('should return 400 status code if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      makeBadRequest(new MissingParamError('passwordConfirm'))
    )
  })

  it('should return 400 if email is invalid', async () => {
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

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeBadRequest(new InvalidParamError('email')))
  })

  it('should call emailvalidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(getFakeRequest())

    expect(isValidSpy).toHaveBeenCalledWith('loremipsum@email.com')
  })

  it('should return 500 if email validator throws error', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(getFakeRequest())
    expect(httpResponse).toEqual(makeInternalServerError(new ServerError()))
  })

  it('should returns 400 if password does not match', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#',
        passwordConfirm: 'liquam eleifend mi in nulla'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      makeBadRequest(new InvalidParamError('passwordConfirm'))
    )
  })

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
})
