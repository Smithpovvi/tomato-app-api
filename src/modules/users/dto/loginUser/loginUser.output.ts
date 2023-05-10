import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginUserOutput {
  @Field(() => String)
  readonly token!: string;
}
