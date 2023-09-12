'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_collections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_product_collections.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    is_featured: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ec_product_collections',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ec_product_collections;
};