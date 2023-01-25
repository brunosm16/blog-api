import { AccountModel } from '../../presentation/controllers/signup/signup-controller-protocols'
import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { EmailFieldValidation } from './email-field-validation'

interface SutTypes {
  sut: EmailFieldValidation
  emailValidatorStub: EmailValidator
}

const getFakeAccount = (): AccountModel => ({
  id: 'fake-id',
  name: 'lorem-ipsum',
  email: 'loremipsum@email.com',
  password: 'fake_hashed_password'
})

const makeValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeValidatorStub()
  const sut = new EmailFieldValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailFieldValidation', () => {
  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const { email } = getFakeAccount()

    sut.validate(getFakeAccount())

    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  it('Should return error if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const fakeAccount = {
      id: 'fake-id',
      name: 'lorem-ipsum',
      email: 'loremipsum@',
      password: 'fake_hashed_password'
    }

    const expectedError = new InvalidParamError('email')

    const error = sut.validate(fakeAccount)

    expect(error).toEqual(expectedError)
  })

  it('Should return null if email is valid', () => {
    const { sut } = makeSut()

    const error = sut.validate(getFakeAccount())

    expect(error).toEqual(null)
  })
})
