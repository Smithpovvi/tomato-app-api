import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import { HttpService } from "@nestjs/axios";
import { IFacebookAuthData } from "@common/types/api.types";

@Injectable()
export class AuthService {
  authClient = new OAuth2Client();

  constructor(private readonly jwtService: JwtService, private readonly httpService: HttpService) {}

  async createAuthSession(login: string, id: number): Promise<string> {
    const token = this.jwtService.sign(
      { login, id },
      {
        secret: process.env.PRIVATE_KEY || "SECRET",
      }
    );
    return `Bearer ${token}`;
  }

  async cryptionPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(comparePassword: string, existingPassword: string): Promise<boolean> {
    return await bcrypt.compare(comparePassword, existingPassword);
  }

  async verifyGoogleSession(idToken: string): Promise<TokenPayload | undefined> {
    const authSession = await this.authClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return authSession?.getPayload();
  }

  async verifyFacebookSession(accessToken: string): Promise<IFacebookAuthData> {
    return await this.httpService
      .get("https://graph.facebook.com/me", {
        params: {
          fields: ["id", "email", "first_name", "last_name"].join(","),
          access_token: accessToken,
        },
      })
      .toPromise()
      .then((resp) => resp?.data);
  }
}
