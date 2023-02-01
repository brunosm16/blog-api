import { LoginController } from '../../../../../presentation/controllers/login/login-controller'
import { makeLoginValidation } from '../login/login-factory-validation'
import { Controller } from '../../../../../presentation/protocols'
import { makeDbAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidation(),
    makeDbAuthentication()
  )

  return makeLogControllerDecorator(loginController)
}
