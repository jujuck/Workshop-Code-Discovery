import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, MinLength, IsString } from "class-validator";

@ObjectType()
@Entity("user")
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  hash: string;
}

@InputType()
export class DefaultUser {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class AuthInput extends DefaultUser {
  @Field()
  @MinLength(8)
  password: string;
}

@InputType()
export class UserInput extends AuthInput {
  @Field({ nullable: true })
  profil?: string;

  @Field({ nullable: true })
  @IsString()
  firstname?: string;

  @Field({ nullable: true })
  @IsString()
  lastname?: string;

  @Field({ nullable: true })
  @IsString()
  speciality?: string;

  @Field({ nullable: true })
  @IsString()
  pseudo?: string;

  @Field({ nullable: true })
  @IsString()
  avatar?: string;
}
