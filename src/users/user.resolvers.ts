import { keyNotFound, serveurError } from "../services/errors.services";
import { User, UserInput, AuthInput } from "./user.entities";
import { Profil } from "../profils/profil.entity";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { hashOptions } from "../utils/hash";
import { ProfilsResolver } from "../profils/profil.resolvers";
import { AuthorsResolver } from "../authors/author.resolvers";
import "dotenv/config";

import type { MyContext } from "../types/context.type";

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async signup(@Arg("data") data: UserInput) {
    try {
      const { password, email } = data;
      const hash = await argon2.hash(password, hashOptions);

      if (data.avatar && data.pseudo) {
        const { pseudo, avatar } = data;
        const profil = await ProfilsResolver.signup({
          email,
          hash,
          avatar,
          pseudo,
        });
        if (profil.id) {
          return true;
        }
      }

      if (data.firstname && data.speciality && data.lastname) {
        const { firstname, lastname, speciality } = data;
        const author = await AuthorsResolver.signup({
          email,
          hash,
          firstname,
          lastname,
          speciality,
        });
        if (author.id) {
          return true;
        }
      }

      keyNotFound("Informations de creation erronée");
    } catch (error) {
      serveurError(error, "users");
    }
  }

  @Mutation(() => Boolean)
  async login(@Arg("data") data: AuthInput, @Ctx() context: MyContext) {
    try {
      const { email, password } = data;

      // Step 1, vérification si user avec email
      const user = await User.findOneByOrFail({ email });

      if (await argon2.verify(user.hash, password)) {
        const type = user instanceof Profil ? "profil" : "author";
        // Générer une clé jwt
        const token = jwt.sign(
          { email, isConnected: true, type },
          process.env.SECRET_JWT_KEY,
          { expiresIn: "24h" }
        );

        // Envoie de la clé dans l'entete de réponse pour le navigateur
        context.res.setHeader(
          "Set-Cookie",
          `blog_access=${token};httpOnly;secure;`
        );

        // Envoie du succès dans le corps de la réponse
        return true;
      }
      keyNotFound("Informations de connexion erronée");
    } catch (error) {
      serveurError(error, "users");
    }
  }
}
