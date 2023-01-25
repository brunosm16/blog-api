import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { MongoAccountRepository } from '../../../../infra/db/mongodb/account-repository/mongo-account-repository'

export const makeAddAccount = (): AddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)

  const mongoAccountRepository = new MongoAccountRepository()

  return new DbAddAccount(hasher, mongoAccountRepository)
}
