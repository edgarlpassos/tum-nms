'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    user: DataTypes.INTEGER,
    comment: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    Like.belongsTo(models.Comment);
    Like.belongsTo(models.User);
  };
  return Like;
};
