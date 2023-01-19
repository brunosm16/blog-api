import { Validation } from '../../presentation/helpers/validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Tests', () => {
  it('should call ValidationComposite with correct validations', () => {
    makeSignUpValidation()

    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

    const validations: Validation[] = []

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
