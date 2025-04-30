import { GraphQLError } from "graphql";
import { MiddlewareFn } from "type-graphql";
import type { MyContext } from "../types/context.type";
import { User } from "../users/user.entities";
import dataSource from "../db/client";

export const isRessourceOwner = <T>(
  className: { new (): T },
  relation: string,
  key: string | number
): MiddlewareFn<MyContext> => {
  return async ({ context, args }, next) => {
    if (!args.data[key]) {
      throw new GraphQLError("No key to find ressources", {
        extensions: {
          code: 422,
        },
      });
    }

    const user = await User.findOneByOrFail({ email: context?.user.email });
    const instance = dataSource.getRepository(className);
    const ressource = await instance.findOne({
      where: {
        ...(args.data[key] && { id: args.data[key] }),
        [key]: { id: user.id },
      },
      relations: [relation],
    });

    if (!ressource) {
      throw new GraphQLError("Accès refusé : vous n'êtes pas le propriétaire", {
        extensions: {
          code: 403,
        },
      });
    }

    context.resource = ressource;
    return next();
  };
};
