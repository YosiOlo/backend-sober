'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_brands extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_brands.hasMany(models.ec_products, {foreignKey: 'brand_id',})
    }
  }
  ec_brands.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    website: DataTypes.STRING,
    logo: DataTypes.STRING,
    status: DataTypes.STRING,
    order: DataTypes.INTEGER,
    is_featured: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_brands',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  return ec_brands;
};