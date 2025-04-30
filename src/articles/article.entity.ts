import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import { IsString, MinLength } from "class-validator";
import { Author } from "../authors/author.entity";

@ObjectType()
@Entity("article")
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  subtitle: string;

  @Column()
  @Field()
  content: string;

  @Column()
  @Field()
  image_src: string;

  @Column()
  @Field()
  image_alt: string;

  @Column()
  @Field()
  keywords: string;

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.articles)
  author: Author;
}

@InputType()
export class ArticleInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  @MinLength(15)
  title: string;

  @Field()
  @MinLength(25)
  subtitle: string;

  @Field()
  @MinLength(300)
  content: string;

  @Field()
  @IsString()
  image_src: string;

  @Field()
  @IsString()
  image_alt: string;

  @Field()
  @IsString()
  keywords: string;
}
