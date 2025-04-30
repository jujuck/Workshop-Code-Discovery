import { serveurError } from "../services/errors.services";
import { Author, AuthorInput } from "./author.entity";
import { Resolver, Arg, Query, Authorized } from "type-graphql";

@Resolver()
export class AuthorsResolver {
  @Authorized(["author"])
  @Query(() => Author)
  async getOneAuthorByEmail(@Arg("email") email: string) {
    try {
      return await Author.findOneByOrFail({ email });
    } catch (error) {
      serveurError(error, "auteurs");
    }
  }

  static async signup(@Arg("data") data: AuthorInput) {
    try {
      const profil = new Author();
      Object.assign(profil, data);

      const result = await profil.save();
      return result;
    } catch (error) {
      serveurError(error, "auteurs");
    }
  }
}
