import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)

    const newAccount = Object.assign(
      {},
      { ...account },
      { password: hashedPassword }
    )

    return await this.addAccountRepository.add(newAccount)
  }
}
