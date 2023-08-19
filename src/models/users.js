'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    email: DataTypes.STRING,
    email_verified_at: DataTypes.DATE,
    password: DataTypes.STRING,
    remember_token: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    avatar_id: DataTypes.INTEGER,
    super_user: DataTypes.BOOLEAN,
    manage_supers: DataTypes.BOOLEAN,
    permissions: DataTypes.TEXT,
    last_login: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};