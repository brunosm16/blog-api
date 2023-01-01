import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

describe('SignUpController Tests', () => {
  it('should return 400 status code if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('name')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should return 400 status code if no email is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        password: 'loremipsum123@#'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('email')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should return 400 status code if no password is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('password')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })

  it('should return 400 status code if no password is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'Lorem Ipsum',
        email: 'loremipsum@email.com',
        password: 'loremipsum123@#'
      }
    }

    const { statusCode, body } = sut.handle(httpRequest)

    const expectedError = new MissingParamError('passwordConfirm')

    expect(statusCode).toBe(400)
    expect(body).toEqual(expectedError)
  })
})
