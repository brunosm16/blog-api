import { PostModel } from '../../../domain/models/post'
import { LoadPostsRepository } from '../../protocols/db/post/load-posts-repository'
import { DbLoadPosts } from './db-load-posts'

interface SutTypes {
  sut: DbLoadPosts
  loadPostsRepositoryStub: LoadPostsRepository
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

const makeLoadPostsRepository = (): LoadPostsRepository => {
  class LoadPostsRepositoryStub implements LoadPostsRepository {
    async loadAll (): Promise<PostModel[]> {
      return await new Promise((resolve) => resolve(makeFakePosts()))
    }
  }

  return new LoadPostsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPostsRepositoryStub = makeLoadPostsRepository()
  const sut = new DbLoadPosts(loadPostsRepositoryStub)

  return {
    sut,
    loadPostsRepositoryStub
  }
}

describe('DbLoadPosts Repository', () => {
  it('should call load-posts-repository', async () => {
    const { sut, loadPostsRepositoryStub } = makeSut()

    const loadAllSpy = jest.spyOn(loadPostsRepositoryStub, 'loadAll')

    await sut.load()

    expect(loadAllSpy).toHaveBeenCalled()
  })

  it('should return a list of posts on load-posts-repository success', async () => {
    const { sut } = makeSut()

    const result = await sut.load()

    expect(result).toEqual(makeFakePosts())
  })
})
