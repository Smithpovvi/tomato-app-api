import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BadRequestException, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { User } from "@models/user.model";
import { UsersService } from "./services/users.service";
import { EmailService } from "../email/services/email.service";
import { AuthService } from "../auth/services/authService/auth.service";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { CreateUserInput } from "./dto/createUser/createUser.input";
import { LoginUserInput } from "./dto/loginUser/loginUser.input";
import { LoginUserOutput } from "./dto/loginUser/loginUser.output";
import { ActivationUserInput } from "./dto/activationUser/activationUser.input";
import { creatUserMessages, loginUserMessages } from "./constants/users.constants";
import * as randomstring from "randomstring";
import { FacebookSignInInput } from "@modules/users/dto/social/facebookSignIn.input";
import { GoogleSignInInput } from "@modules/users/dto/social/googleSignIn.input";
import { activationAccountMessages } from "@modules/email/constants/template.constants";
import { StatusCodeOutput } from "@common/types/statusCode.output";

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private authService: AuthService
  ) {}

  @Mutation(() => StatusCodeOutput)
  async createUser(
    @Args("createUserArgs") createUserArgs: CreateUserInput
  ): Promise<StatusCodeOutput> {
    const user =
      (await this.usersService.getOneByLogin(createUserArgs.login)) ||
      (await this.usersService.getOneByEmail(createUserArgs.email));
    const transitionUser = this.usersService.getTransitionUser(createUserArgs.login);
    if (!user) {
      if (!transitionUser) {
        const activationCode = randomstring.generate(6);
        try {
          const mailVariables = {
            subjectMessage: activationAccountMessages.subjectMessage,
            headerMessage: activationAccountMessages.headerMessage,
            extraMessage: activationAccountMessages.extraMessage,
            activationCode,
          };
          await this.emailService.sendActivationCode(createUserArgs.email, mailVariables);
        } catch (error) {
          throw new InternalServerErrorException();
        }
        const password = await this.authService.cryptionPassword(createUserArgs.password);
        if (
          this.usersService.createTransitionUser(
            {
              ...createUserArgs,
              password,
            },
            activationCode
          )
        ) {
          return { statusCode: 1 };
        } else {
          throw new BadRequestException(creatUserMessages.TRY_LATER);
        }
      } else {
        throw new BadRequestException(creatUserMessages.NEED_ACTIVATE);
      }
    } else {
      throw new BadRequestException(creatUserMessages.USER_EXIST);
    }
  }

  @Mutation(() => LoginUserOutput)
  async loginUser(@Args("loginUserArgs") loginUserArgs: LoginUserInput) {
    const user = await this.usersService.getOneByLogin(loginUserArgs.login);
    let passwordEquals = false;
    if (user) {
      passwordEquals = await this.authService.comparePassword(
        loginUserArgs.password,
        user.password
      );
    }
    if (user && passwordEquals) {
      const token = await this.authService.createAuthSession(user.login, user.id);
      return { token };
    } else {
      throw new BadRequestException(loginUserMessages.INCORRECT_CREDENTIALS);
    }
  }

  @Mutation(() => StatusCodeOutput)
  async activationUser(
    @Args("activationUserArgs") activationUserArgs: ActivationUserInput
  ): Promise<StatusCodeOutput> {
    const transitionAccount = this.usersService.getTransitionUser(activationUserArgs.login);
    if (transitionAccount) {
      const { login, email, activationCode, password } = transitionAccount;
      const user =
        (await this.usersService.getOneByLogin(login)) ||
        (await this.usersService.getOneByEmail(email));
      if (!user) {
        if (activationCode === activationUserArgs.code) {
          try {
            await this.usersService.createUser({ email, login, password });
          } catch (e) {
            throw new InternalServerErrorException();
          }
          this.usersService.removeTransitionUser(login);
          return { statusCode: 1 };
        } else {
          throw new BadRequestException(creatUserMessages.ACTIVATION_CODE_INCORRECT);
        }
      } else {
        throw new BadRequestException(creatUserMessages.USER_EXIST);
      }
    } else {
      throw new BadRequestException(creatUserMessages.TRY_AGAIN);
    }
  }

  @Mutation(() => LoginUserOutput)
  async googleSignIn(@Args("googleSignInArgs") googleSignInArgs: GoogleSignInInput) {
    let token;
    const authSessionData = await this.authService.verifyGoogleSession(googleSignInArgs.idToken);
    if (authSessionData) {
      let user = await this.usersService.getOneByGoogleId(authSessionData.sub);
      if (!user) {
        user = await this.usersService.getOneByEmail(authSessionData.email || "");
        if (user) {
          throw new BadRequestException(creatUserMessages.AUTH_METHOD_UNAVAILABLE);
        }
        const createdUser = await this.usersService.createGooglelUser(authSessionData);
        if (createdUser) {
          token = await this.authService.createAuthSession(createdUser.email, createdUser.id);
          return { token };
        } else {
          throw new InternalServerErrorException();
        }
      } else {
        token = await this.authService.createAuthSession(user.email, user.id);
        return { token };
      }
    } else {
      throw new BadRequestException(loginUserMessages.INCORRECT_CREDENTIALS);
    }
  }

  @Mutation(() => LoginUserOutput)
  async facebookSignIn(@Args("facebookSignInArgs") facebookSignInArgs: FacebookSignInInput) {
    let token;
    const authSessionData = await this.authService.verifyFacebookSession(
      facebookSignInArgs.accessToken
    );
    if (authSessionData) {
      let user = await this.usersService.getOneByFacebookId(authSessionData.id);
      if (!user) {
        user = await this.usersService.getOneByEmail(authSessionData.email);
        if (user) {
          throw new BadRequestException(creatUserMessages.AUTH_METHOD_UNAVAILABLE);
        }
        const createdUser = await this.usersService.createFacebooklUser(authSessionData);
        if (createdUser) {
          token = await this.authService.createAuthSession(createdUser.email, createdUser.id);
          return { token };
        } else {
          throw new InternalServerErrorException();
        }
      } else {
        token = await this.authService.createAuthSession(user.email, user.id);
        return { token };
      }
    } else {
      throw new BadRequestException(loginUserMessages.INCORRECT_CREDENTIALS);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async getUsersList() {
    return this.usersService.getAllUsers();
  }
}
