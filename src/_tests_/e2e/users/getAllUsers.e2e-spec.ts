import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { UsersService } from "@modules/users/services/users.service";
import { AuthService } from "@modules/auth/services/authService/auth.service";
import { testUser } from "@tests/mocks/users.mock";
import { createTestingModule } from "@tests/helpers/createTestingModule";

jest.useFakeTimers();

describe("loginUser", () => {
  let app: INestApplication;
  let userService: UsersService;
  let authService: AuthService;

  let token: string;

  const Query = () => `
      query {
          getUsersList {
              id
              email
              login
          }
      }
    `;

  beforeEach(async () => {
    app = await createTestingModule();
    userService = app.get(UsersService);
    authService = app.get(AuthService);
    token = await authService.createAuthSession(testUser.login, 1);
    const user = await userService.createUser(testUser);
    token = await authService.createAuthSession(user.login, user.id);
  });

  afterEach(async () => {
    await app.close();
  });

  test("Should return users", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: Query(),
      })
      .set("Authorization", token);

    expect(body.data.getUsersList[0].login).toEqual(testUser.login);
  });

  test("Should return: Unauthorized", async () => {
    const { body } = await request(app.getHttpServer()).post("/graphql").send({
      query: Query(),
    });
    expect(body.errors[0].message).toEqual("Unauthorized");
  });
});
