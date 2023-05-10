import { mockId, testSeason } from "@tests/mocks/users.mock";
import { Test, TestingModule } from "@nestjs/testing";
import { SeasonsService } from "./seasons.service";
import { InjectionToken } from "@nestjs/common";

describe("SeasonsService", () => {
  let seasonsService: SeasonsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeasonsService],
    })
      .useMocker((token: InjectionToken | undefined) => {
        if (token === "SeasonRepository") {
          return {
            create: jest.fn().mockResolvedValue(testSeason),
            findOne: jest.fn().mockResolvedValue(testSeason),
            destroy: jest.fn().mockResolvedValue(1),
          };
        }
      })
      .compile();
    seasonsService = module.get<SeasonsService>(SeasonsService);
  });

  test("Seasons service should be defined", () => {
    expect(seasonsService).toBeDefined();
  });

  test("createSeason should return a new season", async () => {
    const { seasonName, startDate, endDate } = await seasonsService.createSeason(
      testSeason,
      mockId
    );
    expect(seasonName).toEqual(testSeason.seasonName);
    expect(startDate).toEqual(testSeason.startDate);
    expect(endDate).toEqual(testSeason.endDate);
  });

  test("deleteSeason should remove a season", async () => {
    const season = await seasonsService.createSeason(testSeason, mockId);
    const result = await seasonsService.deleteSeason(season.id);
    expect(result).toEqual(1);
  });

  test("getSeasonByUserId should return a season", async () => {
    const season = await seasonsService.createSeason(testSeason, mockId);
    const result = await seasonsService.getSeasonByUserId(mockId, season.id);
    expect(result).toBeInstanceOf(Object);
    expect(result?.seasonName).toEqual(testSeason.seasonName);
    expect(result?.startDate).toEqual(testSeason.startDate);
    expect(result?.endDate).toEqual(testSeason.endDate);
  });
});
