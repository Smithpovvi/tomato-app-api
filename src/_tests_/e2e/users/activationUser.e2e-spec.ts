import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { UsersService } from "@modules/users/services/users.service";
import { activationCode, testUser } from "@tests/mocks/users.mock";
import { creatUserMessages } from "@modules/users/constants/users.constants";
import { createTestingModule } from "@tests/helpers/createTestingModule";

jest.useFakeTimers();

describe("activationUser", () => {
  let app: INestApplication;
  let userService: UsersService;

  const mutation = () => `
      mutation activationUser($activationUserArgs: ActivationUserInput!) {
          activationUser(activationUserArgs: $activationUserArgs) {
              statusCode
          }
      }
    `;

  beforeEach(async () => {
    app = await createTestingModule();
    userService = await app.get(UsersService);
  });

  afterEach(async () => {
    await app.close();
  });

  test("Should return status code 1", async () => {
    userService.createTransitionUser(testUser, activationCode);
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          activationUserArgs: {
            login: testUser.login,
            code: activationCode,
          },
        },
      });
    expect(body.data.activationUser.statusCode).toBe(1);
  });

  test(`Should return: ${creatUserMessages.ACTIVATION_CODE_INCORRECT}`, async () => {
    userService.createTransitionUser(testUser, activationCode);
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          activationUserArgs: {
            login: testUser.login,
            code: "111222",
          },
        },
      });
    expect(body.errors[0].message).toEqual(creatUserMessages.ACTIVATION_CODE_INCORRECT);
  });

  test(`Should return: ${creatUserMessages.TRY_AGAIN}`, async () => {
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          activationUserArgs: {
            login: testUser.login,
            code: "111222",
          },
        },
      });
    expect(body.errors[0].message).toEqual(creatUserMessages.TRY_AGAIN);
  });
});
