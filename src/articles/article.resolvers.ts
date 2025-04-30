import { serveurError } from "../services/errors.services";
import { Author } from "../authors/author.entity";
import { Article, ArticleInput } from "./article.entity";
import {
  Resolver,
  Arg,
  Query,
  Authorized,
  Ctx,
  Mutation,
  UseMiddleware,
} from "type-graphql";
import type { MyContext } from "../types/context.type";
import { isRessourceOwner } from "../middlewares/auth.middleware";

@Resolver()
export class ArticlesResolver {
  @Query(() => Article)
  async getAllArticle(@Ctx() context: MyContext) {
    try {
      return context.user.isConnected
        ? await Article.find()
        : await Article.find({
            select: ["id", "title", "subtitle", "keywords"],
          });
    } catch (error) {
      serveurError(error, "articles");
    }
  }

  @Authorized()
  @Query(() => Article)
  async getOneArticle(@Arg("id") id: string) {
    try {
      return await Article.findOneByOrFail({ id });
    } catch (error) {
      serveurError(error, "articles");
    }
  }

  @Authorized(["author"])
  @Mutation(() => Article)
  async addOneArticle(
    @Arg("data") data: ArticleInput,
    @Ctx() context: MyContext
  ) {
    try {
      const article = new Article();
      Object.assign(article, data);

      const author = await Author.findOneByOrFail({
        email: context.user.email,
      });
      article.author = author;

      const result = await article.save();
      return result;
    } catch (error) {
      serveurError(error, "articles");
    }
  }

  @Authorized(["author"])
  @UseMiddleware(isRessourceOwner(Article, "author", "id"))
  @Mutation(() => Article)
  async updateOneArticle(
    @Arg("data") data: ArticleInput,
    @Ctx() context: MyContext
  ) {
    try {
      const article = context.resource as Article;
      Object.assign(article, data);

      const result = await article.save();
      return result;
    } catch (error) {
      serveurError(error, "articles");
    }
  }
}
