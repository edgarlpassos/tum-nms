const secrets = require('../secrets.json');

module.exports = {
  development: {
    username: secrets.DEV_DB_USER,
    password: secrets.DEV_DB_PASS,
    database: secrets.DEV_DB_NAME,
    host: secrets.DEV_DB_HOST,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
};
