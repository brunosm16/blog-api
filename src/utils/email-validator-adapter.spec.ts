import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'
import { EmailValidator } from '../presentation/protocols/email-validator'

const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter Tests', () => {
  it('should return false if validator returns false', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const fakeEmail = 'loremipsum@email.com'

    const result = sut.isValid(fakeEmail)

    expect(result).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = makeSut()

    const fakeEmail = 'loremipsum@email.com'

    const result = sut.isValid(fakeEmail)

    expect(result).toBe(true)
  })

  it('should call validator with correct e-mail', () => {
    const sut = makeSut()

    const fakeEmail = 'loremipsum@email.com'

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid(fakeEmail)

    expect(isEmailSpy).toHaveBeenCalledWith(fakeEmail)
  })
})
