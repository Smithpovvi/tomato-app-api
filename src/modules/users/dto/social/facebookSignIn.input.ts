import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class FacebookSignInInput {
  @Field(() => String)
  @IsString()
  readonly accessToken!: string;
}
