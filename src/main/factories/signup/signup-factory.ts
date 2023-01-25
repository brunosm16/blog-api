import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account-repository/mongo-account-repository'
import { AddAccount } from '../../../domain/usecases/add-account'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { makeSignUpValidation } from './signup-factory-validation'
import { makeDbAuthentication } from '../usecases/authentication/db-authentication-factory'

const makeAddAccount = (): AddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()

  return new DbAddAccount(hasher, mongoAccountRepository)
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
