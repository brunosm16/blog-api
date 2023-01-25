import env from '../../config/env'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account-repository/mongo-account-repository'
import { AddAccount } from '../../../domain/usecases/add-account'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { makeSignUpValidation } from './signup-factory-validation'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'

const makeAddAccount = (): AddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()

  return new DbAddAccount(hasher, mongoAccountRepository)
}

const makeBcryptAdapter = (salt = 12): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

const makeJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecret)
}

const makeDbAuthentication = (): DbAuthentication => {
  return new DbAuthentication(
    new MongoAccountRepository(),
    new MongoAccountRepository(),
    makeBcryptAdapter(),
    makeJwtAdapter()
  )
}

export const makeSignUpController = (): Controller => {
  const addAccount = makeAddAccount()
  const signUpController = new SignUpController(
    addAccount,
    makeSignUpValidation(),
    makeDbAuthentication()
  )
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
