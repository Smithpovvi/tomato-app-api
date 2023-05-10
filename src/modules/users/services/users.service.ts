import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User, UserCreationAttr } from "@models/user.model";
import { CreateUserInput } from "../dto/createUser/createUser.input";
import { ITransitionUser } from "../types/users.types";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import { IFacebookAuthData } from "@common/types/api.types";

@Injectable()
export class UsersService {
  transitionUserLive = 90 * 1000;
  private transitionUsers: Map<string, ITransitionUser> = new Map();

  constructor(@InjectModel(User) private usersStore: typeof User) {}

  getTransitionUser(login: string): ITransitionUser | undefined {
    return this.transitionUsers.get(login);
  }

  createTransitionUser(user: CreateUserInput, activationCode: string): boolean {
    if (this.transitionUsers.size < 5) {
      this.transitionUsers.set(user.login, {
        ...user,
        activationCode,
        timer: setTimeout(() => {
          this.removeTransitionUser(user.login);
        }, this.transitionUserLive),
      });
      return true;
    }
    return false;
  }

  removeTransitionUser(login: string): void {
    const user = this.getTransitionUser(login);
    if (user) {
      clearTimeout(user.timer);
      this.transitionUsers.delete(login);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.usersStore.findAll();
  }

  async createUser(userDto: CreateUserInput): Promise<User> {
    return await this.usersStore.create(userDto);
  }

  async createGooglelUser(googleAuthPayload: TokenPayload): Promise<User> {
    const userProto: UserCreationAttr = {
      email: googleAuthPayload.email || "",
      googleUserId: googleAuthPayload.sub,
    };
    return await this.usersStore.create(userProto);
  }

  async createFacebooklUser(facebookAuthPayload: IFacebookAuthData): Promise<User> {
    const userProto: UserCreationAttr = {
      email: facebookAuthPayload.email,
      facebookUserId: facebookAuthPayload.id,
    };
    return await this.usersStore.create(userProto);
  }

  async getOneByEmail(email: string): Promise<User | null> {
    return await this.usersStore.findOne({
      where: { email },
    });
  }

  async getOneByLogin(login: string): Promise<User | null> {
    return await this.usersStore.findOne({
      where: { login },
    });
  }

  async getOneByGoogleId(googleUserId: string): Promise<User | null> {
    return await this.usersStore.findOne({
      where: { googleUserId },
    });
  }

  async getOneByFacebookId(facebookUserId: string): Promise<User | null> {
    return await this.usersStore.findOne({
      where: { facebookUserId },
    });
  }
}
