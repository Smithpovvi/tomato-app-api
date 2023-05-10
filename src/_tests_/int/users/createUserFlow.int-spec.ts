import { UsersService } from "@modules/users/services/users.service";
import { Test, TestingModule } from "@nestjs/testing";
import { InjectionToken } from "@nestjs/common";
import { testUser, testUsersArray } from "@tests/mocks/users.mock";
import * as randomstring from "randomstring";
import { AuthService } from "@modules/auth/services/authService/auth.service";
import { JwtService } from "@nestjs/jwt";
import { createMock } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";

describe("createUserFlow", () => {
  let userService: UsersService;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, AuthService],
    })
      .useMocker((token: InjectionToken | undefined) => {
        if (token === "UserRepository") {
          return {
            findAll: jest.fn().mockResolvedValue(testUsersArray),
            create: jest.fn().mockResolvedValue(testUser),
            findOne: jest.fn().mockResolvedValue(testUser),
          };
        }
        if (token === JwtService) {
          return createMock<JwtService>();
        }
        if (token === HttpService) {
          return createMock<HttpService>();
        }
      })
      .compile();
    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    jest.useFakeTimers();
  });

  it("Successful create user flow", async () => {
    const activationCode = randomstring.generate(6);
    expect(activationCode).toBeDefined();
    expect(activationCode).toHaveLength(6);

    const generatedPassword = await authService.cryptionPassword(testUser.password);
    expect(generatedPassword).toBeDefined();

    const transitionUserCreated = userService.createTransitionUser(
      { ...testUser, password: generatedPassword },
      activationCode
    );
    expect(transitionUserCreated).toEqual(true);

    const transitionUser = userService.getTransitionUser(testUser.login);
    expect(transitionUser).toBeDefined();
    expect(transitionUser?.login).toEqual(testUser.login);
    expect(transitionUser?.email).toEqual(testUser.email);
    expect(transitionUser?.password).toEqual(generatedPassword);
    expect(transitionUser?.activationCode).toEqual(activationCode);

    const user = await userService.createUser(testUser);
    expect(user).toBeDefined();
  });
});
