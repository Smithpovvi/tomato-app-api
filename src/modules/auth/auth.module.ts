import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./services/authService/auth.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.PRIVATE_KEY || "SECRET",
        signOptions: {
          expiresIn: "1h",
        },
      }),
    }),
    HttpModule,
  ],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
