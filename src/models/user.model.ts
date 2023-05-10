import { Season } from "./season.model";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";

export interface UserCreationAttr {
  email: string;
  password?: string;
  login?: string;
  googleUserId?: string;
  facebookUserId?: string;
}

@ObjectType()
@Table({
  tableName: "users",
})
export class User extends Model<User, UserCreationAttr> {
  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Field(() => String)
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email!: string;

  @HideField()
  @Column({ type: DataType.STRING, allowNull: true })
  password!: string;

  @Field(() => String)
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  login!: string;

  @Field(() => Date)
  @Column({ type: DataType.DATE, allowNull: true })
  createdAt!: Date;

  @Field(() => Date)
  @Column({ type: DataType.DATE, allowNull: true })
  updatedAt!: Date;

  @Field(() => String)
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  googleUserId!: string;

  @Field(() => String)
  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  facebookUserId!: string;

  @HasMany(() => Season)
  seasons!: Season[];
}
