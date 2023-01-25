import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    const { email, password } = account

    const hashedPassword = await this.hasher.hash(password)

    await this.loadAccountByEmailRepository.loadByEmail(email)

    const newAccount = Object.assign(
      {},
      { ...account },
      { password: hashedPassword }
    )

    return await this.addAccountRepository.add(newAccount)
  }
}
