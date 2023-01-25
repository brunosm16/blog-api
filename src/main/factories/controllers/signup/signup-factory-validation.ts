import { Validation } from '../../../../presentation/protocols/validation'
import {
  CompareFieldsValidation,
  EmailFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../adapter/validators/email-validator-adapter'

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
