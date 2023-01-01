export class SignUpController {
  handle (httpRequest: any): any {
    const { body } = httpRequest
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!body[field]) {
        return {
          statusCode: 400,
          body: new Error(`Missing param: ${field}`)
        }
      }
    }
  }
}
