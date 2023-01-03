import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter Tests', () => {
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const fakeEmail = 'loremipsum@email.com'

    const result = sut.isValid(fakeEmail)

    expect(result).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()

    const fakeEmail = 'loremipsum@email.com'

    const result = sut.isValid(fakeEmail)

    expect(result).toBe(true)
  })
})
