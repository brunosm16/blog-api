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

  async getAccount (
    accessToken: string,
    token: string | null,
    role: string | undefined
  ): Promise<AccountModel | null> {
    if (!token || !accessToken) return null

    const account = await this.loadAccountByTokenRepository.loadByToken(
      accessToken,
      role
    )

    return account
  }

  async load (
    accessToken: string,
    role: string | undefined
  ): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)

    const account = await this.getAccount(accessToken, token, role)

    if (account) return account

    return null
  }
}
