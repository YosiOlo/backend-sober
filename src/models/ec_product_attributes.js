'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_attributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_product_attributes.init({
    attribute_set_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    color: DataTypes.STRING,
    image: DataTypes.STRING,
    is_default: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_product_attributes',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_product_attributes;
};