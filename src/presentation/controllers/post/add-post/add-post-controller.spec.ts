import MockDate from 'mockdate'
import { AddPostController } from './add-post-controller'
import { HttpRequest } from './add-post-controller-protocols'
import { Validation } from '../../../protocols/validation'
import {
  makeBadRequest,
  makeInternalServerError,
  makeNoContentRequest
} from '../../../helpers/http/http-helper'
import { AddPost, AddPostModel } from '../../../../domain/usecases/add-post'

interface SutTypes {
  sut: AddPostController
  validationStub: Validation
  addPostStub: AddPost
}

const getFakeRequest = (): HttpRequest => ({
  body: {
    question: 'fake_question',
    answers: [
      {
        image: 'fake_image',
        answer: 'fake_answer'
      }
    ],
    date: new Date()
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

const makeAddPostStub = (): AddPost => {
  class AddPostStub implements AddPost {
    async add (addPostModel: AddPostModel): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }

  return new AddPostStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addPostStub = makeAddPostStub()

  const sut = new AddPostController(validationStub, addPostStub)

  return {
    sut,
    validationStub,
    addPostStub
  }
}

describe('AddPost', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call validate with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(getFakeRequest())

    const { body: expectedBody } = getFakeRequest()

    expect(validateSpy).toHaveBeenCalledWith(expectedBody)
  })

  it('should return 400 if validate fails', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const response = await sut.handle(getFakeRequest())

    expect(response).toEqual(makeBadRequest(new Error()))
  })

  it('should call add-post use-case with correct values', async () => {
    const { sut, addPostStub } = makeSut()

    const addPostSpy = jest.spyOn(addPostStub, 'add')

    await sut.handle(getFakeRequest())

    const { question, answers, date } = getFakeRequest().body

    expect(addPostSpy).toHaveBeenCalledWith({ question, answers, date })
  })

  it('should return 500 if add-post throws', async () => {
    const { sut, addPostStub } = makeSut()

    jest.spyOn(addPostStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(getFakeRequest())

    expect(response).toEqual(makeInternalServerError(new Error()))
  })

  it('should return 201 on add-post success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(getFakeRequest())

    expect(response).toEqual(makeNoContentRequest())
  })
})
