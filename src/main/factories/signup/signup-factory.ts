import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { makeSignUpValidation } from './signup-factory-validation'
import { makeDbAuthentication } from '../usecases/authentication/db-authentication-factory'
import { makeAddAccount } from '../usecases/add-account/db-add-account-factory'

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
