import { User } from "./user.model";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

export interface SeasonCreationAttr {
  seasonName: string;
  startDate: string;
  endDate: string;
  userId: number;
}

@ObjectType()
@Table({
  tableName: "seasons",
})
export class Season extends Model<Season, SeasonCreationAttr> {
  @Field(() => String)
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  seasonName!: string;

  @Field(() => String)
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  startDate!: string;

  @Field(() => String)
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  endDate!: string;

  @Field(() => Int)
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;
}
