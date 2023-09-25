'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_variations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_product_variations.belongsTo(models.ec_products, {foreignKey: 'configurable_product_id'});
      ec_product_variations.belongsTo(models.ec_products, {foreignKey: 'product_id'})
      ec_product_variations.hasOne(models.ec_product_variation_items, {foreignKey: 'variation_id', as: 'items'})
    }
  }
  ec_product_variations.init({
    product_id: DataTypes.INTEGER,
    configurable_product_id: DataTypes.INTEGER,
    is_default: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ec_product_variations',
    timestamps: false
  });
  return ec_product_variations;
};