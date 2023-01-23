import { Validation } from '../../../presentation/protocols/validation'
import {
  CompareFieldsValidation,
  EmailFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-factory-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidation Tests', () => {
  it('should call ValidationComposite with correct validations', () => {
    makeSignUpValidation()

    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

    const validations: Validation[] = []

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))

    validations.push(new EmailFieldValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
