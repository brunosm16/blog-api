import { InvalidParamError, MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  validationsStub: Validation[]
  sut: ValidationComposite
}

const makeValidationsStub = (): Validation[] => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return [new ValidationStub(), new ValidationStub()]
}

const makeSut = (): SutTypes => {
  const validationsStub = makeValidationsStub()
  const sut = new ValidationComposite(validationsStub)

  return {
    sut,
    validationsStub
  }
}
describe('ValidationComposite', () => {
  it('should return error if validation fails', () => {
    const { sut, validationsStub } = makeSut()

    jest
      .spyOn(validationsStub[0], 'validate')
      .mockReturnValueOnce(new InvalidParamError('fake_field'))

    const error = sut.validate({ fake_field: 'lorem_ipsum' })
    expect(error).toEqual(new InvalidParamError('fake_field'))
  })

  it('should return first error if validation fails', () => {
    const { sut, validationsStub } = makeSut()

    jest
      .spyOn(validationsStub[0], 'validate')
      .mockReturnValueOnce(new InvalidParamError('fake_field'))
    jest
      .spyOn(validationsStub[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('fake_field'))

    const error = sut.validate({ fake_field: 'lorem_ipsum' })
    expect(error).toEqual(new InvalidParamError('fake_field'))
  })

  it('should return null if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ fake_field: 'lorem_ipsum' })
    expect(error).toEqual(null)
  })
})
