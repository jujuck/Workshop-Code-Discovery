import { serveurError } from "../services/errors.services";
import { Profil, ProfilInput } from "./profil.entity";
import { Query, Resolver, Arg } from "type-graphql";

@Resolver()
export class ProfilsResolver {
  @Query(() => Profil)
  async getOneProfilByEmail(@Arg("email") email: string) {
    try {
      return await Profil.findOneByOrFail({ email });
    } catch (error) {
      serveurError(error, "profils");
    }
  }

  static async signup(@Arg("data") data: ProfilInput) {
    try {
      const profil = new Profil();
      Object.assign(profil, data);

      const result = await profil.save();
      return result;
    } catch (error) {
      serveurError(error, "profils");
    }
  }
}
