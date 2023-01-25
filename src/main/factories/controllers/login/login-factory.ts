import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-factory-validation'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { Controller } from '../../../../presentation/protocols'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidation(),
    makeDbAuthentication()
  )

  return new LogControllerDecorator(loginController, new LogMongoRepository())
}
