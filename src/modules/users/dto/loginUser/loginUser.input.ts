import { IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginUserInput {
  @Field(() => String)
  @IsString()
  readonly login!: string;

  @Field(() => String)
  @IsString()
  readonly password!: string;
}
