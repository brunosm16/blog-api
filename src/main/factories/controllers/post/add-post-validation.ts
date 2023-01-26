import { Validation } from '../../../../presentation/protocols/validation'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../validation/validators'

const getValidationsArray = (requiredFields: string[]): Validation[] => {
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return validations
}

export const makeAddPostValidation = (): ValidationComposite => {
  const requiredFields = ['questions', 'answers']
  const validations = getValidationsArray(requiredFields)

  return new ValidationComposite(validations)
}
