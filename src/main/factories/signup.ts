import { DbAddAccount } from '../../data/usecases/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { MongoAccountRepository } from '../../infra/db/mongodb/account-repository/mongo-account-repository'
import { AddAccount } from '../../domain/usecases/add-account'

const makeAddAccount = (): AddAccount => {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()

  return new DbAddAccount(encrypter, mongoAccountRepository)
}

export const makeSignUpController = (): SignUpController => {
  const addAccount = makeAddAccount()
  const emailValidator = new EmailValidatorAdapter()

  return new SignUpController(emailValidator, addAccount)
}
