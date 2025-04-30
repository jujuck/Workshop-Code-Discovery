import { DataSource } from "typeorm";
import "dotenv/config";

import { User } from "../users/user.entities";
import { Profil } from "../profils/profil.entity";
import { Article } from "../articles/article.entity";
import { Author } from "../authors/author.entity";

const dataSource = new DataSource({
  entities: [User, Profil, Article, Author],
  type: "postgres",
  host: "db", // Nom du container en prod, souvent en variable d'environnement
  port: 5432,
  username: process.env.DB_USER, // Nom de l'utilisateur de DB, souvent en variable d'environnement
  password: process.env.DB_PASSWORD, // MOt de passe, toujours en variable d'environnement
  database: process.env.DB_NAME, // Nom de la base de donnée, souvent en variable d'environnement
  synchronize: true, // Désactivé en production (Possible de la mettre en variable d'env)
  migrations: ["src/migrations/*.ts"], // Destination de nos fichiers de migration
});

export default dataSource;
