import { Field, InputType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";

@InputType()
export class DeleteSeasonInput {
  @Field(() => Number)
  @IsNumber()
  readonly id!: number;
}
