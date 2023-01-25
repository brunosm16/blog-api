import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const { email, password } = account

    const accountFound = await this.loadAccountByEmailRepository.loadByEmail(
      email
    )

    if (!accountFound) {
      const hashedPassword = await this.hasher.hash(password)

      const newAccount = Object.assign(
        {},
        { ...account },
        { password: hashedPassword }
      )

      return await this.addAccountRepository.add(newAccount)
    }

    return null
  }
}
