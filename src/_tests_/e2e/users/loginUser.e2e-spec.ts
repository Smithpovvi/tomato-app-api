import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { UsersService } from "@modules/users/services/users.service";
import { AuthService } from "@modules/auth/services/authService/auth.service";
import { testUser } from "@tests/mocks/users.mock";
import { loginUserMessages } from "@modules/users/constants/users.constants";
import { createTestingModule } from "@tests/helpers/createTestingModule";

jest.useFakeTimers();

describe("loginUser", () => {
  let app: INestApplication;
  let userService: UsersService;
  let authService: AuthService;

  const mutation = () => `
      mutation loginUser($loginUserArgs: LoginUserInput!) {
          loginUser(loginUserArgs: $loginUserArgs) {
              token
          }
      }
    `;

  beforeEach(async () => {
    app = await createTestingModule();
    userService = app.get(UsersService);
    authService = app.get(AuthService);
    const cryptPassword = await authService.cryptionPassword(testUser.password);
    await userService.createUser({ ...testUser, password: cryptPassword });
  });

  afterEach(async () => {
    await app.close();
  });

  test("Should return token", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          loginUserArgs: {
            login: testUser.login,
            password: testUser.password,
          },
        },
      });
    expect(body.data.loginUser.token).toBeDefined();
  });

  test(`Should return: ${loginUserMessages.INCORRECT_CREDENTIALS}`, async () => {
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          loginUserArgs: {
            login: testUser.login,
            password: "asdqwer1241",
          },
        },
      });
    expect(body.errors[0].message).toEqual(loginUserMessages.INCORRECT_CREDENTIALS);
  });
});
