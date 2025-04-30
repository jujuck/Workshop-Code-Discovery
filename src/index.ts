import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dataSource from "./db/client";

import "dotenv/config";

import jwt from "jsonwebtoken";
import getSchema from "./schema";
import { formatError } from "./services/errors.services";

(async () => {
  await dataSource.initialize();

  const schema = await getSchema();

  const server = new ApolloServer({
    schema,
    formatError: formatError,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: +process.env.SERVER_PORT },
    context: async ({ req, res }) => {
      if (!req.headers.cookie) return { res };

      const cookies = req.headers.cookie.split("; ").reduce((acc, key) => {
        const cook = key.split("=");
        if (cook[0].startsWith("blog_access")) {
          acc[cook[0]] = cook[1];
        }
        return acc;
      }, {}) as { [key: string]: string };

      if (cookies.blog_access) {
        const payload = jwt.verify(
          cookies.blog_access,
          process.env.SECRET_JWT_KEY
        );

        if (payload) {
          return { res, user: payload };
        }
        return { res };
      }

      return { res };
    },
  });

  console.info(`Server is running on ${url}`);
})();
