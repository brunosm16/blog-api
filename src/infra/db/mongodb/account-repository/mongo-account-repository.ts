import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoAccountRepository implements AddAccountRepository {
  async add (addAccount: AddAccountModel): Promise<AccountModel> {
    const collection = MongoHelper.getCollectionByName('accounts')

    const { ops } = await collection.insertOne(addAccount)

    return MongoHelper.map(ops[0])
  }
}
