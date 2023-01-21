import { Validation } from '../../../presentation/protocols/validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-field-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

const requiredFields = ['email', 'password']

const getValidationsArray = (): Validation[] => {
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(
    new EmailFieldValidation('email', new EmailValidatorAdapter())
  )

  return validations
}

export const makeLoginValidation = (): ValidationComposite => {
  return new ValidationComposite(getValidationsArray())
}
