import { Validation } from '../../../../presentation/protocols/validation'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../validation/validators'
import { makeAddPostValidation } from './add-post-validation'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddPostValidation | Factory', () => {
  it('should call validation-composite with correct validations', () => {
    makeAddPostValidation()

    const requiredFields = ['questions', 'answers']

    const validations: Validation[] = []

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
