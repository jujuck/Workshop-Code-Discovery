import { Field, InputType, ObjectType } from "type-graphql";
import { IsEmail, IsString, MinLength } from "class-validator";
import { ChildEntity, Column } from "typeorm";
import { DefaultUser, User } from "../users/user.entities";

@ObjectType()
@ChildEntity()
export class Profil extends User {
  @Column()
  @Field()
  pseudo: string;

  @Column()
  @Field()
  avatar: string;
}

export class ProfilInput extends DefaultUser {
  @Field()
  @IsString()
  hash: string;

  @Field()
  @IsString()
  pseudo: string;

  @Field()
  @IsString()
  avatar: string;
}
