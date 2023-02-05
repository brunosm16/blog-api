import MockDate from 'mockdate'
import { LoadPostsController } from './load-posts-controller'
import {
  LoadPosts,
  HttpRequest,
  makeOKRequest,
  PostModel,
  makeInternalServerError
} from './load-posts-controller-protocols'

interface SutTypes {
  sut: LoadPostsController
  loadPostsStub: LoadPosts
}

const makeFakePosts = (): PostModel[] => {
  return [
    {
      id: 'fake_post_id_1',
      question: 'fake_question_1',
      answers: [
        {
          image: 'fake_image_1',
          answer: 'fake_answer_1'
        }
      ],
      date: new Date()
    },
    {
      id: 'fake_post_id_2',
      question: 'fake_question_2',
      answers: [
        {
          image: 'fake_image_2',
          answer: 'fake_answer_2'
        }
      ],
      date: new Date()
    }
  ]
}

const getFakeRequest = (): HttpRequest => ({
  body: {
    ok: 'ok'
  }
})

const makeLoadPosts = (): LoadPosts => {
  class LoadPostsStub implements LoadPosts {
    async load (): Promise<PostModel[]> {
      return await new Promise((resolve) => resolve(makeFakePosts()))
    }
  }

  return new LoadPostsStub()
}

const makeSut = (): SutTypes => {
  const loadPostsStub = makeLoadPosts()
  const sut = new LoadPostsController(loadPostsStub)

  return {
    sut,
    loadPostsStub
  }
}

describe('LoadPostsController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  it('should call load-posts use case', async () => {
    const { sut, loadPostsStub } = makeSut()

    const loadPostsSpy = jest.spyOn(loadPostsStub, 'load')

    await sut.handle(getFakeRequest())

    expect(loadPostsSpy).toHaveBeenCalled()
  })

  it('should return 200 on load-posts success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(getFakeRequest())

    const posts = makeFakePosts()

    expect(response).toEqual(makeOKRequest(posts))
  })

  it('should throws if load-posts throws', async () => {
    const { sut, loadPostsStub } = makeSut()

    jest
      .spyOn(loadPostsStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const response = await sut.handle(getFakeRequest())

    expect(response).toEqual(makeInternalServerError(new Error()))
  })
})
