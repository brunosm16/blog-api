import { AuthenticationModel } from '../../../domain/models/authentication'
import { Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    updateAccessTokenRepository: UpdateAccessTokenRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async generateToken (id: string | undefined): Promise<string | null> {
    if (!id) return null
    return await this.tokenGenerator.generate(id)
  }

  async passwordIsValid (
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await this.hashComparer.compare(password, hashedPassword)
  }

  async authIsValid (
    account: AccountModel | null,
    password: string
  ): Promise<boolean> {
    if (!account) return false

    const { password: hashedPassword } = account

    const validAuth = await this.hashComparer.compare(password, hashedPassword)

    return validAuth
  }

  async updateAccessToken (
    id: string | undefined,
    accessToken: string | null
  ): Promise<void> {
    if (id && accessToken) {
      await this.updateAccessTokenRepository.update(id, accessToken)
    }
  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const accountResult = await this.loadAccountByEmailRepository.load(
      authentication.email
    )

    const validAuth = await this.authIsValid(
      accountResult,
      authentication.password
    )

    if (!validAuth) return null

    const accessToken = await this.generateToken(accountResult?.id)

    await this.updateAccessToken(accountResult?.id, accessToken)

    return accessToken
  }
}
