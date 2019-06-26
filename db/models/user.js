'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {});
  User.associate = function(models) {
  };
  return User;
};
