import { Model, DataTypes } from 'sequelize';

class Video extends Model {
  static associate(models) {
    this.userAssociation = models.Video.belongsTo(models.User);
  }

  static init(sequelize) {
    return super.init({
      name: DataTypes.STRING,
      owner: DataTypes.INTEGER,
      location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'Videos',
    });
  }
}

export default Video;
