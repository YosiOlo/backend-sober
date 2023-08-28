'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_orders.hasOne(models.ec_order_addresses,{ foreignKey: 'order_id', as: 'order_addresses' });
      ec_orders.hasOne(models.ec_order_histories,{ foreignKey: 'order_id', as: 'order_histories' });
      ec_orders.hasOne(models.ec_order_product, { foreignKey: 'order_id', as: 'order_product' });
      ec_orders.hasOne(models.ec_order_referrals, { foreignKey: 'order_id', as: 'order_referrals' });
      ec_orders.hasOne(models.ec_order_returns, { foreignKey: 'order_id', as: 'order_returns' });
      ec_orders.hasOne(models.midtrans, { foreignKey: 'order_id', as: 'order_token'})
    }
  }
  ec_orders.init({
    code: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    shipping_option: DataTypes.STRING,
    shipping_method: DataTypes.STRING,
    status: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    tax_amount: DataTypes.DECIMAL,
    shipping_amount: DataTypes.DECIMAL,
    description: DataTypes.TEXT,
    coupon_code: DataTypes.STRING,
    discount_amount: DataTypes.DECIMAL,
    sub_total: DataTypes.DECIMAL,
    is_confirmed: DataTypes.BOOLEAN,
    discount_description: DataTypes.STRING,
    is_finished: DataTypes.BOOLEAN,
    completed_at: DataTypes.DATE,
    token: DataTypes.STRING,
    payment_id: DataTypes.INTEGER,
    store_id: DataTypes.INTEGER,
    shipping_service: DataTypes.STRING,
    id_paket: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_orders',
    timestamps: false
  });
  return ec_orders;
};