'use strict';
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    name: DataTypes.STRING,
    owner: DataTypes.INTEGER,
    location: DataTypes.STRING
  }, {});
  Video.associate = function(models) {
    Video.belongsTo(models.User);
  };
  return Video;
};
