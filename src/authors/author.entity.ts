import { ChildEntity, Column, OneToMany } from "typeorm";
import { Field, ObjectType, InputType } from "type-graphql";
import { IsString } from "class-validator";
import { DefaultUser, User } from "../users/user.entities";
import { Article } from "../articles/article.entity";

@ObjectType()
@ChildEntity()
export class Author extends User {
  @Column()
  @Field()
  firstname: string;

  @Column()
  @Field()
  lastname: string;

  @Column()
  @Field()
  speciality: string;

  @Field(() => Article)
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}

@InputType()
export class AuthorInput extends DefaultUser {
  @IsString()
  hash: string;

  @Field()
  @IsString()
  lastname: string;

  @Field()
  @IsString()
  firstname: string;

  @Field()
  @IsString()
  speciality: string;
}
