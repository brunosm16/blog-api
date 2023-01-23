import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly field: string) {}

  validate (input: any): Error | null {
    if (!input[this.field]) {
      return new MissingParamError(this.field)
    }

    return null
  }
}
