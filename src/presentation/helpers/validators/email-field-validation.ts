import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from './validation'

export class EmailFieldValidation implements Validation {
  private readonly validator: EmailValidator
  private readonly field: string

  constructor (field: string, validator: EmailValidator) {
    this.field = field
    this.validator = validator
  }

  validate (input: any): Error | null {
    if (!this.validator.isValid(input[this.field])) {
      return new InvalidParamError('email')
    }

    return null
  }
}
