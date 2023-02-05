import { PostResultModel } from '@/domain/models/post-result-model'

export type SavePostResultModel = Omit<PostResultModel, 'id'>

export interface SavePostResult {
  save: (data: SavePostResultModel) => Promise<PostResultModel>
}
