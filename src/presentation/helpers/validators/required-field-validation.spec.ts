import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (field = 'fake_field'): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('RequiredFieldValidation', () => {
  it("should return error if required field doesn't exists", () => {
    const sut = makeSut()
    const error = sut.validate({ lorem: 'ipsum' })
    expect(error).toEqual(new MissingParamError('fake_field'))
  })

  it('should return null if require field exists', () => {
    const sut = makeSut()
    const error = sut.validate({ fake_field: 'fake_field test' })
    expect(error).toEqual(null)
  })
})
