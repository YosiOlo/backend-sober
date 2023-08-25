'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_currency.init({
    title: DataTypes.STRING,
    symbol: DataTypes.STRING,
    is_prefix_symbol: DataTypes.BOOLEAN,
    decimals: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    is_default: DataTypes.BOOLEAN,
    exchange_rate: DataTypes.DOUBLE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_currency',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_currency;
};