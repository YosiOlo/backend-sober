'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_carts.init({
    customer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    attributes: DataTypes.STRING,
    extras: DataTypes.STRING,
    options: DataTypes.STRING,
    is_buynow: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_carts',
    tableName: 'ec_carts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ec_carts;
};