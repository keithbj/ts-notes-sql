import config from 'config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(config.get('db'), config.get('dbUser'), config.get('dbPassword'), {
  dialect: 'mysql',
  host: config.get('dbServer'),
  logging: (msg) => console.info(msg),
});
