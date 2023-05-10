import { SeasonsService } from "./../../../modules/seasons/services/seasons.service";
import { testSeason, testUser } from "./../../mocks/users.mock";
import { INestApplication } from "@nestjs/common";
import { createTestingModule } from "@tests/helpers/createTestingModule";
import * as request from "supertest";
import { AuthService } from "@modules/auth/services/authService/auth.service";
import { UsersService } from "@modules/users/services/users.service";

describe("createSeason", () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UsersService;
  // let seasonService: SeasonsService;
  let token: string;

  const mutation = () => `
    mutation createSeason($createSeasonArgs: CreateSeasonInput!) {
        createSeason(createSeasonArgs: $createSeasonArgs) {
            id
            seasonName
            startDate
            endDate
        }
    }
  `;

  beforeEach(async () => {
    app = await createTestingModule();
    authService = app.get(AuthService);
    userService = app.get(UsersService);
    // seasonService = app.get(SeasonsService);
    const user = await userService.createUser(testUser);
    token = await authService.createAuthSession(user.login, user.id);
  });

  afterEach(async () => {
    await app.close();
  });

  test("Should return a season", async () => {
    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({
        query: mutation(),
        variables: {
          createSeasonArgs: testSeason,
        },
      })
      .set("Authorization", token);

    expect(body.data.createSeason.seasonName).toEqual(testSeason.seasonName);
  });

  // test("Should remove a season", async () => {
  //   const season = await seasonService.createSeason(testSeason, 1);
  //   const { body } = await request(app.getHttpServer())
  //     .post("/graphql")
  //     .send({
  //       query: mutation(),
  //       variables: {
  //         createSeasonArgs: testSeason,
  //       },
  //     })
  //     .set("Authorization", token);

  //   expect(body.data.createSeason.seasonName).toEqual(testSeason.seasonName);
  // });
});
