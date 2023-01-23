import env from '../../config/env'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account-repository/mongo-account-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-factory-validation'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { Controller } from '../../../presentation/protocols'

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

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidation(),
    makeDbAuthentication()
  )

  return new LogControllerDecorator(loginController, new LogMongoRepository())
}
