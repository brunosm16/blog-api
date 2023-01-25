export interface AddPostModel {
  question: string
  answers: PostAnswer[]
}

export interface PostAnswer {
  image: string
  answer: string
}

export interface AddPost {
  add: (addPostModel: AddPostModel) => Promise<void>
}
