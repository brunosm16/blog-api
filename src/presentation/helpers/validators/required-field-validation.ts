import { MissingParamError } from '../../errors'
import { Validation } from '../validation'

export class RequiredFieldValidation implements Validation {
  private readonly field: string

  constructor (field: string) {
    this.field = field
  }

  validate (input: any): Error | null {
    if (!input[this.field]) {
      return new MissingParamError(this.field)
    }

    return null
  }
}
