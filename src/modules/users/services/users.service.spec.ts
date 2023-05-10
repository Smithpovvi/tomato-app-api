import { UsersService } from "./users.service";
import {
  activationCode,
  mockGoogleAuthTokenPayload,
  testSocialUser,
  testUser,
  testUsersArray,
} from "@tests/mocks/users.mock";
import { Test, TestingModule } from "@nestjs/testing";
import { InjectionToken } from "@nestjs/common";

describe("UserService", () => {
  let userService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token: InjectionToken | undefined) => {
        if (token === "UserRepository") {
          return {
            findAll: jest.fn().mockResolvedValue(testUsersArray),
            create: jest.fn().mockResolvedValue(testSocialUser),
            findOne: jest.fn().mockResolvedValue(testSocialUser),
          };
        }
      })
      .compile();
    userService = module.get<UsersService>(UsersService);
    jest.useFakeTimers();
  });

  test("User service should be defined", () => {
    expect(userService).toBeDefined();
  });

  test("createUser should return new user", async () => {
    const { login, email } = await userService.createUser(testUser);
    expect(login).toEqual(testUser.login);
    expect(email).toEqual(testUser.email);
  });

  test("createGoogleUser should return new user with google id", async () => {
    const { login, email, googleUserId } = await userService.createGooglelUser(
      mockGoogleAuthTokenPayload
    );
    expect(login).toEqual(testUser.login);
    expect(email).toEqual(testUser.email);
    expect(googleUserId).toEqual(testSocialUser.googleUserId);
  });

  test("createFacebookUser should return new user with facebook id", async () => {
    const { login, email, googleUserId } = await userService.createGooglelUser(
      mockGoogleAuthTokenPayload
    );
    expect(login).toEqual(testUser.login);
    expect(email).toEqual(testUser.email);
    expect(googleUserId).toEqual(testSocialUser.googleUserId);
  });

  test("getOneByEmail should find user by email", async () => {
    await userService.createUser(testUser);
    const user = await userService.getOneByEmail(testUser.email);
    expect(user).toBeDefined();
    expect(user?.login).toEqual(testUser.login);
    expect(user?.email).toEqual(testUser.email);
  });

  test("getOneByLogin should find user by login", async () => {
    await userService.createUser(testUser);
    const user = await userService.getOneByLogin(testUser.login);
    expect(user).toBeDefined();
    expect(user?.login).toEqual(testUser.login);
    expect(user?.email).toEqual(testUser.email);
  });

  test("getOneByGoogleId should find user by google id", async () => {
    await userService.createUser(testUser);
    const user = await userService.getOneByLogin(testSocialUser.googleUserId);
    expect(user).toBeDefined();
    expect(user?.login).toEqual(testUser.login);
    expect(user?.email).toEqual(testUser.email);
    expect(user?.googleUserId).toEqual(testSocialUser.googleUserId);
  });

  test("getOneByFacebookId should find user by facebook id", async () => {
    await userService.createUser(testUser);
    const user = await userService.getOneByLogin(testSocialUser.facebookUserId);
    expect(user).toBeDefined();
    expect(user?.login).toEqual(testUser.login);
    expect(user?.email).toEqual(testUser.email);
    expect(user?.facebookUserId).toEqual(testSocialUser.facebookUserId);
  });

  test("getAllUsers return pre-created users", async () => {
    await testUsersArray.forEach((user) => userService.createUser(user));
    const users = await userService.getAllUsers();
    expect(users).toHaveLength(testUsersArray.length);
  });

  test("createTransitionUser should create transition user", () => {
    const result = userService.createTransitionUser(testUser, activationCode);
    expect(result).toBe(true);
  });

  test("getTransitionUser should return transition user", () => {
    userService.createTransitionUser(testUser, activationCode);
    const user = userService.getTransitionUser(testUser.login);
    expect(user?.login).toEqual(testUser.login);
    expect(user?.activationCode).toEqual(activationCode);
  });

  test("removeTransitionUser remove transition user", () => {
    userService.createTransitionUser(testUser, activationCode);
    userService.removeTransitionUser(testUser.login);
    const user = userService.getTransitionUser(testUser.login);
    expect(user).toBeUndefined();
  });
});
