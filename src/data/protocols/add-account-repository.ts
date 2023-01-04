import {
  AccountModel,
  AddAccountModel
} from '../usecases/db-add-account-protocols'

export interface AddAccountRepository {
  add: (addAccount: AddAccountModel) => Promise<AccountModel>
}
