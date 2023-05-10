import { Season } from "@models/season.model";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateSeasonInput } from "../types/createSeason/createSeason.input";

@Injectable()
export class SeasonsService {
  constructor(@InjectModel(Season) private seasonsStore: typeof Season) {}

  createSeason(seasonDto: CreateSeasonInput, userId: number): Promise<Season> {
    return this.seasonsStore.create({ ...seasonDto, userId });
  }

  deleteSeason(id: number): Promise<number> {
    return this.seasonsStore.destroy({ where: { id } });
  }

  getSeasonByUserId(userId: number, id: number): Promise<Season | null> {
    return this.seasonsStore.findOne({ where: { userId, id } });
  }
}
