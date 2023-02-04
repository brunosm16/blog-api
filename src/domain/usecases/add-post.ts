export interface AddPostModel {
  question: string
  answers: PostAnswer[]
  date: Date
}

export interface PostAnswer {
  image?: string
  answer: string
}

export interface AddPost {
  add: (postData: AddPostModel) => Promise<void>
}
