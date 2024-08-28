import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const database = process.env.NODE_ENV === 'test' 
  ? process.env.DB_TEST_DATABASE
  : process.env.DB_DATABASE;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: database,
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '../entities/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
});
