import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static associate(models) {}

  static init(sequelize) {
    return super.init({
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      picture: DataTypes.STRING,
    }, { sequelize });
  }
}

export default User;
