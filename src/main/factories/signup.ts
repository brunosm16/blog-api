import { DbAddAccount } from '../../data/usecases/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { MongoAccountRepository } from '../../infra/db/mongodb/account-repository/mongo-account-repository'
import { AddAccount } from '../../domain/usecases/add-account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log-controller'

const makeAddAccount = (): AddAccount => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()

  return new DbAddAccount(encrypter, mongoAccountRepository)
}

export const makeSignUpController = (): Controller => {
  const addAccount = makeAddAccount()
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidator, addAccount)

  return new LogControllerDecorator(signUpController)
}
