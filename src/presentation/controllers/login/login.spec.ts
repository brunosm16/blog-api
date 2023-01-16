import { MissingParamError } from '../../errors'
import { makeBadRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  return {
    sut: new LoginController()
  }
}

describe('LoginController Tests', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'loremipsum123@'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeBadRequest(new MissingParamError('email')))
  })
})
