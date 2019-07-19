import Sequelize from 'sequelize';
import config from '../db/config';

const dbConfig = process.env.NODE_ENV === 'production' ? config.production : config.development;

const dbConnection = new Sequelize(
  dbConfig.database, dbConfig.username, dbConfig.password,
  { host: dbConfig.host, dialect: dbConfig.dialect },
);

export default dbConnection;
