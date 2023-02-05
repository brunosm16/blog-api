import { MongoHelper } from '../helpers/mongo-helper'
import { MongoPostResultRepository } from './mongo-post-result-repository'

type SutTypes = {
  sut: MongoPostResultRepository
}

const makeSut = (): SutTypes => ({
  sut: new MongoPostResultRepository()
})

let postsCollection
let accountsCollection
let postResultsCollection

const makePost = async (): Promise<any> => {
  const result = await postsCollection.insertOne({
    question: 'fake_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  })

  return result.ops[0]
}

const makeAccount = async (): Promise<any> => {
  const result = await accountsCollection.insertOne({
    name: 'lorem-ipsum',
    email: 'loremipsum@email.com',
    password: 'fake_hashed_password'
  })

  return result.ops[0]
}

describe('MongoPostResultRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollectionByName('accounts')
    await accountsCollection.deleteMany({})

    postsCollection = await MongoHelper.getCollectionByName('posts')
    await postsCollection.deleteMany({})

    postResultsCollection = await MongoHelper.getCollectionByName('postResults')
    await postResultsCollection.deleteMany({})
  })

  it('should return an post-result on save success', async () => {
    const { answers, _id: postId } = await makePost()

    const answer = answers[0].answer

    const { _id: accountId } = await makeAccount()

    const { sut } = makeSut()

    const result = await sut.save({
      postId,
      accountId,
      answer,
      date: new Date()
    })

    expect(result).toBeTruthy()
    expect(result.id).toBeTruthy()
    expect(result.answer).toEqual(answer)
  })
})
