import { DbLoadAccountByToken } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '../../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { MongoAccountRepository } from '../../../../infra/db/mongodb/account-repository/mongo-account-repository'
import env from '../../../config/env'

export const makeDbLoadAccount = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new MongoAccountRepository()

  return new DbLoadAccountByToken(jwtAdapter, loadAccountByTokenRepository)
}
