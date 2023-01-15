import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
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
})
