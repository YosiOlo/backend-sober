'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_order_return_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_order_return_items.belongsTo(models.ec_order_returns, { foreignKey: 'order_return_id', as: 'return_items' });
    }
  }
  ec_order_return_items.init({
    order_return_id: DataTypes.INTEGER,
    order_product_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    product_image: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    reason: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ec_order_return_items',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_order_return_items;
};