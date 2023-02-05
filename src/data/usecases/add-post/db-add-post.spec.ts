import { PostModel } from '../../../domain/models/post'
import MockDate from 'mockdate'
import { AddPostModel } from '../../../domain/usecases/add-post'
import { AddPostRepository } from '../../protocols/db/post/add-post-repository'
import { DbAddPost } from './db-add-post'

interface SutTypes {
  sut: DbAddPost
  addPostRepositoryStub: AddPostRepository
}

const getFakePost = (): PostModel => ({
  id: 'fake_id',
  question: 'fake_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeAddPostRepositoryStub = (): AddPostRepository => {
  class AddPostRepositoryStub implements AddPostRepository {
    async add (postData: AddPostModel): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }

  return new AddPostRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addPostRepositoryStub = makeAddPostRepositoryStub()
  const sut = new DbAddPost(addPostRepositoryStub)

  return {
    sut,
    addPostRepositoryStub
  }
}

describe('DbAddPost ', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call addPostRepository witch correct values', async () => {
    const { sut, addPostRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addPostRepositoryStub, 'add')

    await sut.add(getFakePost())

    expect(addSpy).toHaveBeenCalledWith(getFakePost())
  })
})
