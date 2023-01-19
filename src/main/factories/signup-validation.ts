import { Validation } from '../../presentation/helpers/validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

const getValidationsArray = (): Validation[] => {
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))

  return validations
}

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite(getValidationsArray())
}
