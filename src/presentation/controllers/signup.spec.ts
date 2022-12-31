import { SignUpController } from "./signup";

describe("SignUpController Tests", () => {
  it("should return 400 status code if no name is provided", () => {
    const sut = new SignUpController();

    const httpRequest = {
      body: {
        name: "Lorem Ipsum",
        email: "loremipsum@email.com",
        password: "loremipsum123@#",
      },
    };

    const { statusCode } = sut.handle(httpRequest);

    expect(statusCode).toBe(400);
  });
});
