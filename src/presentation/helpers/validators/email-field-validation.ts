import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validation'

export class EmailFieldValidation implements Validation {
  constructor (
    private readonly field: string,
    private readonly validator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    if (!this.validator.isValid(input[this.field])) {
      return new InvalidParamError('email')
    }

    return null
  }
}
