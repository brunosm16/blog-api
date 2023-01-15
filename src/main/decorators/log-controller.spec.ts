import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { makeInternalServerError } from '../../presentation/helpers/http-helper'
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

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          ok: 'ok'
        }
      }

      return await new Promise((resolve) => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
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

    const httpRequest = {
      body: {
        ok: 'ok'
      }
    }

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same response as controller', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        ok: 'ok'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response).toEqual({
      statusCode: 200,
      body: {
        ok: 'ok'
      }
    })
  })

  it('should call log-error-repository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    const stackMock = 'stack_test'

    const serverError = createServerError(stackMock)

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(serverError)))

    const httpRequest = {
      body: {
        ok: 'ok'
      }
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith(stackMock)
  })
})
