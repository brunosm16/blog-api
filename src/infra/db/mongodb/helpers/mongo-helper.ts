import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  uri: null as unknown as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect () {
    await this.client.close()
    this.client = null
  },

  async getCollectionByName (name: string): Collection {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }

    return this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...insertedWithNoId } = collection
    return Object.assign({}, { ...insertedWithNoId }, { id: _id })
  }
}
