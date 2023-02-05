import { PostResultModel } from '@/domain/models/post-result-model'
import { SavePostResultModel } from '@/domain/usecases/save-post-result'

export interface SavePostResultRepository {
  save: (data: SavePostResultModel) => Promise<PostResultModel>
}
