import { MongoHelper as sut } from './mongo-helper'

beforeAll(async () => {
  await sut.connect(process.env.MONGO_URL ?? '')
})

afterAll(async () => {
  await sut.disconnect()
})

describe('MongoHelper Tests', () => {
  it('should reconnect if mongodb client is down', async () => {
    let accounts = await sut.getCollectionByName('accounts')

    expect(accounts).toBeTruthy()

    await sut.disconnect()

    accounts = await sut.getCollectionByName('accounts')
    expect(accounts).toBeTruthy()
  })
})
