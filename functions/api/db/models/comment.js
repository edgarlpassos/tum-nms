import { Model, DataTypes } from 'sequelize';

class Comment extends Model {
  static associate(models) {
    this.userAssociation = models.Comment.belongsTo(models.Video);
    this.userAssociation = models.Comment.belongsTo(models.User);
  }

  static init(sequelize) {
    return super.init({
      content: DataTypes.STRING,
      video: DataTypes.INTEGER,
      timestamp: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'Comments',
    });
  }
}

export default Comment;
