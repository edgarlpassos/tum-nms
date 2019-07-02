'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    video: DataTypes.INTEGER,
    timestamp: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Video);
    Comment.belongsTo(models.User);
  };
  return Comment;
};
