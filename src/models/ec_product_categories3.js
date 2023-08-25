'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_categories3 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here\
      ec_product_categories3.hasMany(models.ec_products, {foreignKey: 'kategori3'}),
      ec_product_categories3.belongsTo(models.ec_product_categories2, {foreignKey: 'parent_id'})
    }
  }
  ec_product_categories3.init({
    name: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    order: DataTypes.INTEGER,
    image: DataTypes.STRING,
    is_featured: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_product_categories3',
    tableName: 'ec_product_categories3',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  return ec_product_categories3;
};