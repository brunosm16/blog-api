import {
  LoadAccountByToken,
  LoadAccountByTokenRepository,
  Decrypter,
  AccountModel
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async getAccountByToken (token: string | null): Promise<AccountModel | null> {
    if (!token) return null

    const account = await this.loadAccountByTokenRepository.loadByToken(token)

    return account
  }

  async load (accessToken: string): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    const account = await this.getAccountByToken(token)

    if (account) return account

    return null
  }
}
