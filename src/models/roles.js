'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  roles.init({
    slug: DataTypes.STRING,
    name: DataTypes.STRING,
    permissions: DataTypes.TEXT,
    description: DataTypes.STRING,
    is_default: DataTypes.BOOLEAN,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return roles;
};