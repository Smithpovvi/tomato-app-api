import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "@models/user.model";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./services/users.service";
import { AuthModule } from "../auth/auth.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule, EmailModule],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
