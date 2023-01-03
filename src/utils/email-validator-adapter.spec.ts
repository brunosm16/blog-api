import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter Tests', () => {
  it('should return false if email is invalid', () => {
    const sut = new EmailValidatorAdapter()

    const fakeEmail = 'loremipsum'

    const result = sut.isValid(fakeEmail)

    expect(result).toBe(false)
  })
})
