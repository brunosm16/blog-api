import { PostAnswer } from '../models/post'

export interface AddPostModel {
  question: string
  answers: PostAnswer
  date: Date
}

export interface AddPost {
  add: (postData: AddPostModel) => Promise<void>
}
