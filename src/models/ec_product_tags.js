'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_product_tags.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_product_tags',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ec_product_tags;
};