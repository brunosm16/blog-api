import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (
  field = 'fake_field',
  fakeFieldToCompare = 'fake_field_to_compare'
): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fakeFieldToCompare)
}

describe('CompareFieldsValidation', () => {
  it('should returns error if fields are no the same', () => {
    const sut = makeSut()

    const input = {
      fake_field: 'lorem_ipsum',
      fake_field_to_compare: 'integer_varius'
    }

    const error = sut.validate(input)
    expect(error).toEqual(new InvalidParamError('fake_field_to_compare'))
  })

  it('should return true if fields are the same', () => {
    const sut = makeSut()

    const input = {
      fake_field: 'lorem_ipsum',
      fake_field_to_compare: 'lorem_ipsum'
    }

    const error = sut.validate(input)
    expect(error).toEqual(null)
  })
})
