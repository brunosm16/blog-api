import {
  EmailFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../adapter/validators/email-validator-adapter'

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
