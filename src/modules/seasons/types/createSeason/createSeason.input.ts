import { Field, InputType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";

@InputType()
export class CreateSeasonInput {
  @Field(() => String)
  @IsString()
  @Length(3, 20)
  readonly seasonName!: string;

  @Field(() => String)
  @IsString()
  readonly startDate!: string;

  @Field(() => String)
  @IsString()
  readonly endDate!: string;
}
