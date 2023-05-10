import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ActivationUserInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly login!: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  readonly code!: string;
}
