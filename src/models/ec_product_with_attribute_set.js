'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_with_attribute_set extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_product_with_attribute_set.belongsTo(models.ec_products, {foreignKey: 'product_id', as: 'product_attribute_set'})
      ec_product_with_attribute_set.belongsTo(models.ec_product_attribute_sets, {foreignKey: 'attribute_set_id', as: 'attribute_set'})
      ec_product_with_attribute_set.belongsTo(models.ec_product_attribute_sets, {foreignKey: 'order', as: 'order_attribute_set'})
    }
  }
  ec_product_with_attribute_set.init({
    attribute_set_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_product_with_attribute_set',
    tableName: 'ec_product_with_attribute_set',
    timestamps: false
  });
  return ec_product_with_attribute_set;
};