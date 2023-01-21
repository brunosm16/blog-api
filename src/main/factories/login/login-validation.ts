import {
  EmailFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
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
