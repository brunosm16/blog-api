import {
  LoadAccountByToken,
  Decrypter,
  AccountModel
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}

  async load (accessToken: string): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken)

    return null
  }
}
