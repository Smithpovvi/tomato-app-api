import { UsersService } from "@modules/users/services/users.service";
import { Test, TestingModule } from "@nestjs/testing";
import { InjectionToken } from "@nestjs/common";
import { mockId, mockToken, testUser, testUsersArray } from "@tests/mocks/users.mock";
import { AuthService } from "@modules/auth/services/authService/auth.service";
import { JwtService } from "@nestjs/jwt";
import { createMock } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";

describe("signInUserFlow", () => {
  let userService: UsersService;
  let authService: AuthService;
  let cryptedPassword: string;

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
          return {
            sign: jest.fn().mockResolvedValue(mockToken),
          };
        }
        if (token === HttpService) {
          return createMock<HttpService>();
        }
      })
      .compile();
    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    jest.useFakeTimers();

    cryptedPassword = await authService.cryptionPassword(testUser.password);
    expect(cryptedPassword).toBeDefined();
  });

  it("Successful sign in user flow", async () => {
    const userByLogin = await userService.getOneByLogin(testUser.login);
    expect(userByLogin).toBeDefined();
    expect(userByLogin?.login).toEqual(testUser.login);

    const userByEmail = await userService.getOneByEmail(testUser.email);
    expect(userByEmail).toBeDefined();
    expect(userByEmail?.email).toEqual(testUser.email);

    const passwordEquals = await authService.comparePassword(testUser.password, cryptedPassword);
    expect(passwordEquals).toEqual(true);

    const token = await authService.createAuthSession(testUser.login, mockId);
    expect(token).toBeDefined();
    expect(token.includes("Bearer")).toEqual(true);
  });
});
