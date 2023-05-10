import { Injectable } from "@nestjs/common";
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";
import models from "@models/index";

@Injectable()
export class SequalizeTestConfig implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      dialect: "sqlite",
      storage: ":memory:",
      models,
    };
  }
}
