const Sequelize = require('sequelize');
const config  = require('../db/config.js');
const db = process.env.NODE_ENV === 'production' ? config.production : config.development;

module.exports = new Sequelize(
    db.database, db.username, db.password,
    { host: db.host, dialect: db.dialect }
);

