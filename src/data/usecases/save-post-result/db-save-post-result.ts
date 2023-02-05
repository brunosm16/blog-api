import {
  PostResultModel,
  SavePostResult,
  SavePostResultModel,
  SavePostResultRepository
} from './db-save-post-result-protocols'

export class DbSavePostResult implements SavePostResult {
  constructor (
    private readonly savePostResultRepository: SavePostResultRepository
  ) {}

  async save (data: SavePostResultModel): Promise<PostResultModel> {
    const saveResult = await this.savePostResultRepository.save(data)

    return saveResult
  }
}
