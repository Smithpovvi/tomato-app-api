import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";
import { Injectable } from "@nestjs/common";
import models from "@models/index";

@Injectable()
export class SequelizeConfig implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      host: process.env.MARIADB_HOST,
      port: Number(process.env.MARIADB_PORT),
      username: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_NAME,
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      dialect: "mariadb",
      models,
    };
  }
}
