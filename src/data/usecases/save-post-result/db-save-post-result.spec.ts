import MockDate from 'mockdate'
import { DbSavePostResult } from './db-save-post-result'
import {
  SavePostResultRepository,
  PostResultModel,
  SavePostResultModel
} from './db-save-post-result-protocols'

type SutTypes = {
  sut: DbSavePostResult
  savePostResultRepositoryStub: SavePostResultRepository
}

const makeSavePostResultModel = (): SavePostResultModel => ({
  postId: 'fake_postId',
  accountId: 'fake_accountId',
  answer: 'fake_answer',
  date: new Date()
})

const makeFakePostResultModel = (): PostResultModel =>
  Object.assign({}, makeSavePostResultModel(), { id: 'fake_id' })

const makeSavePostResultRepository = (): SavePostResultRepository => {
  class SavePostResultRepositoryStub implements SavePostResultRepository {
    async save (data: SavePostResultModel): Promise<PostResultModel> {
      return await new Promise((resolve) => resolve(makeFakePostResultModel()))
    }
  }

  return new SavePostResultRepositoryStub()
}

const makeSut = (): SutTypes => {
  const savePostResultRepositoryStub = makeSavePostResultRepository()
  const sut = new DbSavePostResult(savePostResultRepositoryStub)

  return {
    sut,
    savePostResultRepositoryStub
  }
}

describe('DbSavePostResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call save on db-save-post-result', async () => {
    const { sut, savePostResultRepositoryStub } = makeSut()

    const saveSpy = jest.spyOn(savePostResultRepositoryStub, 'save')

    await sut.save(makeFakePostResultModel())

    expect(saveSpy).toHaveBeenCalled()
  })
})
