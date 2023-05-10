import { SeasonsService } from "./services/seasons.service";
import { CreateSeasonInput } from "./types/createSeason/createSeason.input";
import { Season } from "@models/season.model";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserAuthData, IUserAuthData } from "@common/decorators/user.decorator";
import { InternalServerErrorException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { DeleteSeasonInput } from "./types/deleteSeason/deleteSeason.input";
import { StatusCodeOutput } from "@common/types/statusCode.output";

@Resolver(() => Season)
export class SeasonsResolver {
  constructor(private readonly seasonsService: SeasonsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Season)
  async createSeason(
    @Args("createSeasonArgs") createSeasonArgs: CreateSeasonInput,
    @UserAuthData() userAuthData: IUserAuthData
  ): Promise<Season> {
    try {
      return await this.seasonsService.createSeason(createSeasonArgs, userAuthData.id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => StatusCodeOutput)
  async deleteSeason(
    @Args("deleteSeasonArgs") { id }: DeleteSeasonInput,
    @UserAuthData() userAuthData: IUserAuthData
  ): Promise<StatusCodeOutput> {
    const season = await this.seasonsService.getSeasonByUserId(userAuthData.id, id);
    if (season) {
      try {
        await this.seasonsService.deleteSeason(id);
        return { statusCode: 1 };
      } catch (e) {
        throw new InternalServerErrorException();
      }
    } else {
      throw new InternalServerErrorException();
    }
  }
}
