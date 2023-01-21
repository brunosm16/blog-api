import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { makeInternalServerError } from '../../presentation/helpers/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const createServerError = (stack: string): HttpResponse => {
  const error = new Error()
  error.stack = stack
  return makeInternalServerError(error)
}

const getFakeResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    ok: 'ok'
  }
})

const getFakeRequest = (): HttpRequest => ({
  body: {
    ok: 'ok'
  }
})

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise((resolve) => resolve(getFakeResponse()))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator Tests', () => {
  it('calls controller with correct http-request values', async () => {
    const { sut, controllerStub } = makeSut()

    const httpRequest = getFakeRequest()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(getFakeRequest())

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same response as controller', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(getFakeRequest())
    expect(response).toEqual(getFakeResponse())
  })

  it('should call log-error-repository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    const stackMock = 'stack_test'

    const serverError = createServerError(stackMock)

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(serverError)))

    await sut.handle(getFakeRequest())

    expect(logSpy).toHaveBeenCalledWith(stackMock)
  })
})
