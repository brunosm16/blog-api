import MockDate from 'mockdate'
import { DbLoadPostById } from './db-load-post-by-id'
import {
  LoadPostByIdRepository,
  PostModel
} from './db-load-post-by-id-protocols'

type SutTypes = {
  sut: DbLoadPostById
  loadPostByIdRepositoryStub: LoadPostByIdRepository
}

const makeFakePost = (): PostModel => ({
  id: 'fake_post_id_1',
  question: 'fake_question_1',
  answers: [
    {
      image: 'fake_image_1',
      answer: 'fake_answer_1'
    }
  ],
  date: new Date()
})

const makeLoadPostByIdRepository = (): LoadPostByIdRepository => {
  class LoadPostByIdRepositoryStub implements LoadPostByIdRepository {
    async loadById (id: string): Promise<PostModel> {
      return await new Promise((resolve) => resolve(makeFakePost()))
    }
  }

  return new LoadPostByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPostByIdRepositoryStub = makeLoadPostByIdRepository()

  const sut = new DbLoadPostById(loadPostByIdRepositoryStub)

  return {
    sut,
    loadPostByIdRepositoryStub
  }
}

describe('DbLoadPostById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call load-post-by-id-repository', async () => {
    const { sut, loadPostByIdRepositoryStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadPostByIdRepositoryStub, 'loadById')

    await sut.loadById('fake_id')

    expect(loadByIdSpy).toHaveBeenCalled()
    expect(loadByIdSpy).toHaveBeenCalledWith('fake_id')
  })

  it('should return a post on success', async () => {
    const { sut } = makeSut()

    const result = await sut.loadById('fake_id')

    expect(result).toEqual(makeFakePost())
  })
})
