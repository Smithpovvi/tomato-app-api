import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StatusCodeOutput {
  @Field(() => Int)
  readonly statusCode!: number;
}
