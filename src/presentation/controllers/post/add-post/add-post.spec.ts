import { AddPost } from './add-post'
import { HttpRequest } from './add-post-protocols'
import { Validation } from '../../../protocols/validation'

interface SutTypes {
  sut: AddPost
  validationStub: Validation
}

const getFakeRequest = (): HttpRequest => ({
  body: {
    question: 'fake_question',
    answers: [
      {
        image: 'fake_image',
        answer: 'fake_answer'
      }
    ]
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()

  const sut = new AddPost(validationStub)

  return {
    sut,
    validationStub
  }
}

describe('AddPost', () => {
  it('should call validate with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(getFakeRequest())

    const { body: expectedBody } = getFakeRequest()

    expect(validateSpy).toHaveBeenCalledWith(expectedBody)
  })
})
