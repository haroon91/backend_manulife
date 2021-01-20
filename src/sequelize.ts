import { Sequelize } from 'sequelize-typescript';
import { config } from './config/config';


export const sequelize = new Sequelize({
  database: config.dev.database,
  dialect: 'mysql',
  username: config.dev.username,
  password: config.dev.password,
  host: config.dev.host,
  storage: ':memory:',
  logging: false
});
