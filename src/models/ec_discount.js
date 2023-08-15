'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_discount.init({
    title: DataTypes.STRING,
    code: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    total_used: DataTypes.INTEGER,
    value: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    can_use_with_promotion: DataTypes.BOOLEAN,
    discount_on: DataTypes.STRING,
    product_quantity: DataTypes.INTEGER,
    type_option: DataTypes.STRING,
    target: DataTypes.STRING,
    min_order_price: DataTypes.DECIMAL,
    store_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_discount',
    timestamps: false
  });
  return ec_discount;
};