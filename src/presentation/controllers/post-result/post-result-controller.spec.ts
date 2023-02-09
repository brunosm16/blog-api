import {
  HttpRequest,
  LoadPostById,
  PostModel,
  makeForbiddenError
} from './post-result-controller-protocols'
import { PostResultController } from './post-result-controller'
import {
  InvalidParamError,
  makeInternalServerError
} from '../post/load-posts/load-posts-controller-protocols'

const mockHttpRequest = (): HttpRequest => ({
  params: {
    id: 'fake_id'
  }
})

const mockFakePostModel = (): PostModel => ({
  id: 'fake_id',
  question: 'fake_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

interface SutTypes {
  sut: PostResultController
  loadPostByIdStub: LoadPostById
}

const makeLoadPostById = (): LoadPostById => {
  class LoadPostByIdStub implements LoadPostById {
    async loadById (id: string): Promise<PostModel> {
      return await new Promise((resolve) => resolve(mockFakePostModel()))
    }
  }

  return new LoadPostByIdStub()
}

const makeSut = (): SutTypes => {
  const loadPostByIdStub = makeLoadPostById()
  const sut = new PostResultController(loadPostByIdStub)

  return {
    sut,
    loadPostByIdStub
  }
}

describe('PostResultController', () => {
  it('should call load-by-id with correct values', async () => {
    const { sut, loadPostByIdStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadPostByIdStub, 'loadById')

    await sut.handle(mockHttpRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('fake_id')
  })

  it('should return 403 if post not found', async () => {
    const { sut, loadPostByIdStub } = makeSut()

    jest
      .spyOn(loadPostByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const response = await sut.handle(mockHttpRequest())

    expect(response).toEqual(
      makeForbiddenError(new InvalidParamError('postId'))
    )
  })

  it('should return 500 if load-by-id throws', async () => {
    const { sut, loadPostByIdStub } = makeSut()

    jest
      .spyOn(loadPostByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const response = await sut.handle(mockHttpRequest())

    expect(response).toEqual(makeInternalServerError(new Error()))
  })

  it('should return 403 if answer is invalid', async () => {
    const { sut } = makeSut()

    const fakeRequest = {
      params: {
        id: 'fake_id'
      },
      body: {
        answer: 'fake_answer_non_existent'
      }
    }

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(
      makeForbiddenError(new InvalidParamError('answer'))
    )
  })
})
