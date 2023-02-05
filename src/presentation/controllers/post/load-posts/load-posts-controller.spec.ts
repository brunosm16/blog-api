import { PostModel } from '../../../../domain/models/post'
import { LoadPostsController } from './load-posts-controller'
import { LoadPosts, HttpRequest } from './load-posts-controller-protocols'

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
  it('should call load-posts use case', async () => {
    const { sut, loadPostsStub } = makeSut()

    const loadPostsSpy = jest.spyOn(loadPostsStub, 'load')

    await sut.handle(getFakeRequest())

    expect(loadPostsSpy).toHaveBeenCalled()
  })
})
