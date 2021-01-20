import { Sequelize } from 'sequelize-typescript';
import { config } from './config/config';


export const sequelize = new Sequelize({
  database: config.database,
  dialect: 'mysql',
  username: config.username,
  password: config.password,
  host: config.host,
  storage: ':memory:',
  logging: false
});
