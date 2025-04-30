import { GraphQLError } from "graphql";
import { logger } from "./logs.services";
import "dotenv/config";

export const formatError = (formattedError: unknown) => {
  const err = formattedError as GraphQLError;

  if (process.env.NODE_ENV !== "production") {
    logger.error({
      message: err.message,
      path: err.path,
      locations: err.locations,
      extensions: err.extensions,
    });
  } else {
    console.error("Une erreur est survenue", err);
  }

  return {
    message:
      err.message ||
      "Une erreur indéfinie est survenue, notre équipe technique est déjà en train de travailler à une correction",
    code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
  };
};

export const keyNotFound = (msg) => {
  throw new GraphQLError(msg, {
    extensions: {
      code: 422,
    },
  });
};

export const serveurError = (error, ressource) => {
  throw new GraphQLError(`Erreur serveur au niveau des ${ressource}`, {
    extensions: {
      code: 500,
      error,
    },
  });
};

export const accesDenied = (error, msg) => {
  throw new GraphQLError(`Accès refusé : ${msg}`, {
    extensions: {
      code: 403,
      error,
    },
  });
};
