import { PostAnswer } from '../usecases/add-post'

export interface PostModel {
  id: string
  question: string
  answers: PostAnswer[]
}
