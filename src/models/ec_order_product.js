'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_order_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_order_product.belongsTo(models.ec_orders, { foreignKey: 'order_id' });
    }
  }
  ec_order_product.init({
    order_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    tax_amount: DataTypes.DECIMAL,
    options: DataTypes.TEXT,
    product_options: DataTypes.TEXT,
    product_id: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    product_image: DataTypes.STRING,
    weight: DataTypes.DOUBLE,
    restock_quantity: DataTypes.INTEGER,
    product_type: DataTypes.STRING,
    times_downloaded: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_order_product',
    tableName: 'ec_order_product',
    timestamps: false
  });
  return ec_order_product;
};