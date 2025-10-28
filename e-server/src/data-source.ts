import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "./models/User";
import { Article } from "./models/Articles";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql", // TypeORM usa o driver 'mysql' para MariaDB
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Em produção, sempre use migrations
  logging: true, // Útil para ver as queries SQL no console durante o desenvolvimento
  entities: [User, Article], // Carrega as entidades
  migrations: [],
  subscribers: [],
});