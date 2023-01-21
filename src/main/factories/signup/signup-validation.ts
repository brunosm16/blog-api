import { Validation } from '../../../presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-field-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

const getValidationsArray = (): Validation[] => {
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))

  validations.push(
    new EmailFieldValidation('email', new EmailValidatorAdapter())
  )

  return validations
}

export const makeSignUpValidation = (): ValidationComposite => {
  return new ValidationComposite(getValidationsArray())
}
