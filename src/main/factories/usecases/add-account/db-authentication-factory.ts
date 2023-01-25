import env from '../../../config/env'
import { Authentication } from '../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { MongoAccountRepository } from '../../../../infra/db/mongodb/account-repository/mongo-account-repository'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'

const makeBcryptAdapter = (salt = 12): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

const makeJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecret)
}

export const makeDbAuthentication = (): Authentication => {
  return new DbAuthentication(
    new MongoAccountRepository(),
    new MongoAccountRepository(),
    makeBcryptAdapter(),
    makeJwtAdapter()
  )
}
