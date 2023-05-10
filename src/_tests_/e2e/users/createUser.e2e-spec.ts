import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { UsersService } from "@modules/users/services/users.service";
import { activationCode, testUser, testUsersArray } from "@tests/mocks/users.mock";
import { creatUserMessages } from "@modules/users/constants/users.constants";
import { createTestingModule } from "@tests/helpers/createTestingModule";

jest.useFakeTimers();

describe("createUser", () => {
  let app: INestApplication;

  const mutation = () => `
      mutation createUser($createUserArgs: CreateUserInput!) {
        createUser(createUserArgs: $createUserArgs) {
          statusCode
        }
      }
    `;

  beforeEach(async () => {
    app = await createTestingModule();
  });

  afterEach(async () => {
    await app.close();
  });

  test("Should return status code 1", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          createUserArgs: testUser,
        },
      });
    expect(body.data.createUser.statusCode).toBe(1);
  });

  test("Should return 3 errors", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          createUserArgs: {},
        },
      });
    expect(body.errors).toHaveLength(3);
  });

  test("Should return user exist", async () => {
    const userService = app.get(UsersService);
    await userService.createUser(testUser);
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          createUserArgs: testUser,
        },
      });
    expect(body.errors[0].message).toBe("User exists with this login or an email");
  });

  test(`Should return: ${creatUserMessages.TRY_LATER}`, async () => {
    const userService = app.get(UsersService);
    testUsersArray.forEach((user) => userService.createTransitionUser(user, activationCode));
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          createUserArgs: testUser,
        },
      });
    expect(body.errors[0].message).toEqual(creatUserMessages.TRY_LATER);
  });

  test(`Should return: ${creatUserMessages.NEED_ACTIVATE}`, async () => {
    const userService = app.get(UsersService);
    userService.createTransitionUser(testUser, activationCode);
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          createUserArgs: testUser,
        },
      });
    expect(body.errors[0].message).toEqual(creatUserMessages.NEED_ACTIVATE);
  });
});
