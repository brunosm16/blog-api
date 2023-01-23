import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoAccountRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {
  async add (addAccount: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollectionByName('accounts')

    const { ops } = await collection.insertOne(addAccount)

    return MongoHelper.map(ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const collection = await MongoHelper.getCollectionByName('accounts')

    const accountByEmail = await collection.findOne({ email })

    if (!accountByEmail) return null

    return MongoHelper.map(accountByEmail)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const collection = await MongoHelper.getCollectionByName('accounts')

    await collection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken: token
        }
      }
    )
  }
}
