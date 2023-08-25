'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_cart.init({
    customer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    attributes: DataTypes.STRING,
    extras: DataTypes.STRING,
    options: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    is_buynow: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_cart',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  return ec_cart;
};