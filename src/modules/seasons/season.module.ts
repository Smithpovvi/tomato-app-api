import { Season } from "@models/season.model";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SeasonsResolver } from "./season.resolver";
import { SeasonsService } from "./services/seasons.service";

@Module({
  imports: [SequelizeModule.forFeature([Season])],
  providers: [SeasonsResolver, SeasonsService],
})
export class SeasonModule {}
