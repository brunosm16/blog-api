export interface PostModel {
  id: string
  question: string
  answers: PostAnswer[]
  date: Date
}

export interface PostAnswer {
  image?: string
  answer: string
}
