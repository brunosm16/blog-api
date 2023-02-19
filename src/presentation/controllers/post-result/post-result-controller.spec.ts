import MockDate from 'mockdate'
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
import {
  SavePostResult,
  SavePostResultModel
} from '@/domain/usecases/save-post-result'
import { PostResultModel } from '@/domain/models/post-result-model'

const mockHttpRequest = (): HttpRequest => ({
  accountId: 'fake_account_id',
  params: {
    postId: 'fake_post_id'
  },
  body: {
    answer: 'fake_answer'
  }
})

const mockFakePostModel = (): PostModel => ({
  id: 'fake_id',
  question: 'fake_question',
  answers: [
    {
      image: 'any_image',
      answer: 'fake_answer'
    }
  ],
  date: new Date()
})

const mockFakePostResult = (): PostResultModel => ({
  id: 'fake_post_result',
  postId: 'fake_post_id',
  accountId: 'fake_account_id',
  answer: 'fake_answer',
  date: new Date()
})

const mockFakeSavePostResult = (): SavePostResultModel => ({
  postId: 'fake_post_id',
  accountId: 'fake_account_id',
  answer: 'fake_answer',
  date: new Date()
})

interface SutTypes {
  sut: PostResultController
  loadPostByIdStub: LoadPostById
  savePostResultStub: SavePostResult
}

const makeLoadPostById = (): LoadPostById => {
  class LoadPostByIdStub implements LoadPostById {
    async loadById (id: string): Promise<PostModel> {
      return await new Promise((resolve) => resolve(mockFakePostModel()))
    }
  }

  return new LoadPostByIdStub()
}

const makeSavePostResult = (): SavePostResult => {
  class SavePostResultStub implements SavePostResult {
    async save (data: SavePostResultModel): Promise<PostResultModel> {
      return await new Promise((resolve) => resolve(mockFakePostResult()))
    }
  }

  return new SavePostResultStub()
}

const makeSut = (): SutTypes => {
  const loadPostByIdStub = makeLoadPostById()
  const savePostResultStub = makeSavePostResult()
  const sut = new PostResultController(loadPostByIdStub, savePostResultStub)

  return {
    sut,
    loadPostByIdStub,
    savePostResultStub
  }
}

describe('PostResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call load-by-id with correct values', async () => {
    const { sut, loadPostByIdStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadPostByIdStub, 'loadById')

    await sut.handle(mockHttpRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('fake_post_id')
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
      accountId: 'fake_account_id',
      params: {
        postId: 'fake_post_id'
      },
      body: {
        answer: 'non_existent_answer'
      }
    }

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(
      makeForbiddenError(new InvalidParamError('answer'))
    )
  })

  it('should call save-post-result with correct values', async () => {
    const { sut, savePostResultStub, loadPostByIdStub } = makeSut()

    jest
      .spyOn(loadPostByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => resolve(mockFakePostModel()))
      )

    const saveSpy = jest.spyOn(savePostResultStub, 'save')

    await sut.handle(mockHttpRequest())

    expect(saveSpy).toHaveBeenCalledWith(mockFakeSavePostResult())
  })
})
