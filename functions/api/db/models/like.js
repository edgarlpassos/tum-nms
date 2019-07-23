import { Model, DataTypes } from 'sequelize';

class Like extends Model {
  static associate(models) {
    this.userAssociation = models.Like.belongsTo(models.Comment);
    this.userAssociation = models.Like.belongsTo(models.User);
  }

  static init(sequelize) {
    return super.init({
      comment: DataTypes.INTEGER,
      user: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'Likes',
    });
  }
}

export default Like;
