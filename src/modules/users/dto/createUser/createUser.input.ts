import { IsEmail, IsString, Length, MinLength } from "class-validator";
import { UserModelDescriptions } from "../../constants/users.constants";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @IsEmail({}, { message: UserModelDescriptions.EMAIL })
  readonly email!: string;

  @Field(() => String)
  @IsString()
  @Length(6, 15, {
    message: UserModelDescriptions.PASSWORD,
  })
  readonly password!: string;

  @Field(() => String)
  @IsString()
  @MinLength(4, { message: UserModelDescriptions.LOGIN })
  readonly login!: string;
}
