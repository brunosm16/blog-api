import { Validation } from '../../../../../presentation/protocols/validation'
import {
  EmailFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { makeLoginValidation } from './login-factory-validation'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('LoginValidation Tests', () => {
  it('should call ValidationComposite with correct validations', () => {
    makeLoginValidation()

    const requiredFields = ['email', 'password']

    const validations: Validation[] = []

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailFieldValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
