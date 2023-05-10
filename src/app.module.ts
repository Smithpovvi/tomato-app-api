import { Module } from "@nestjs/common";
import { UsersModule } from "@modules/users/users.module";
import { AppController } from "./app.controller";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { SequelizeModule } from "@nestjs/sequelize";
import { SequelizeConfig } from "./configs/sequelize.config";
import { ConfigModule } from "@nestjs/config";
import { SeasonModule } from "@modules/seasons/season.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfig,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      playground: process.env.NODE_ENV === "dev",
      context: ({ req, res }) => ({ req, res }),
    }),
    UsersModule,
    SeasonModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
