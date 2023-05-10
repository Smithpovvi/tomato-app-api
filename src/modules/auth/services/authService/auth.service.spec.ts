import { AuthService } from "./auth.service";
import { testUser } from "@tests/mocks/users.mock";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { createMock } from "@golevelup/ts-jest";
import { HttpService } from "@nestjs/axios";

describe("UserService", () => {
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return createMock<JwtService>();
        }
        if (token === HttpService) {
          return createMock<HttpService>();
        }
      })
      .compile();
    authService = module.get<AuthService>(AuthService);
  });

  test("Auth service should be defined", () => {
    expect(authService).toBeDefined();
  });

  test("cryptionPassword should return crypt password", async () => {
    const password = await authService.cryptionPassword(testUser.password);
    expect(password).toBeDefined();
    expect(password === testUser.password).toBe(false);
  });

  test("comparePassword should return true", async () => {
    const cryptPassword = await authService.cryptionPassword(testUser.password);
    expect(cryptPassword).toBeDefined();
    const result = await authService.comparePassword(testUser.password, cryptPassword);
    expect(result).toBe(true);
  });
});
