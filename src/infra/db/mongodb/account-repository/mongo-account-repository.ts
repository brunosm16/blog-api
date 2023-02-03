import { Collection } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token-protocols'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoAccountRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository {
  private async getAccountsCollection (): Promise<Collection> {
    const accounts = await MongoHelper.getCollectionByName('accounts')

    return accounts
  }

  async add (addAccount: AddAccountModel): Promise<AccountModel> {
    const collection = await this.getAccountsCollection()

    const { ops } = await collection.insertOne(addAccount)

    return MongoHelper.map(ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const collection = await this.getAccountsCollection()

    const accountByEmail = await collection.findOne({ email })

    if (!accountByEmail) return null

    return MongoHelper.map(accountByEmail)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const collection = await this.getAccountsCollection()

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

  async loadByToken (
    token: string,
    role?: string
  ): Promise<AccountModel | null> {
    const collection = await this.getAccountsCollection()

    const account = await collection.findOne(
      {
        accessToken: token
      },
      {
        $or: [
          {
            role
          },
          {
            role: 'admin'
          }
        ]
      }
    )

    if (!account) return null

    return MongoHelper.map(account)
  }
}
