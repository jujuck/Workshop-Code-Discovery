import { buildSchema } from "type-graphql";
import { ProfilsResolver } from "./profils/profil.resolvers";
import { UserResolver } from "./users/user.resolvers";
import { ArticlesResolver } from "./articles/article.resolvers";

const getSchema = async () => {
  return await buildSchema({
    resolvers: [ProfilsResolver, UserResolver, ArticlesResolver],
    validate: true,
    authChecker: ({ context }, roles: string[]): boolean => {
      if (!context?.user?.isConnected) return false;

      if (roles[0] && roles[0] !== context.user.type) {
        return false;
      }

      return true;
    },
  });
};

export default getSchema;
