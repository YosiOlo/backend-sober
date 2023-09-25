'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_variation_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_product_variation_items.belongsTo(models.ec_product_attributes, {foreignKey: 'attribute_id', as: 'var_items'});
      ec_product_variation_items.belongsTo(models.ec_product_variations, {foreignKey: 'variation_id'})
    }
  }
  ec_product_variation_items.init({
    attribute_id: DataTypes.INTEGER,
    variation_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_product_variation_items',
    timestamps: false
  });
  return ec_product_variation_items;
};