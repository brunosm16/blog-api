import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (
  controller: Controller
): Controller =>
  new LogControllerDecorator(controller, new LogMongoRepository())
