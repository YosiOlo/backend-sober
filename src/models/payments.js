'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      payments.hasOne(models.ec_orders, { foreignKey: 'payment_id', as: 'payment_order'});
    }
  }
  payments.init({
    currency: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    charge_id: DataTypes.STRING,
    payment_channel: DataTypes.STRING,
    description: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    order_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    refunded_amount: DataTypes.DECIMAL,
    refund_note: DataTypes.STRING,
    customer_type: DataTypes.STRING,
    bank: DataTypes.STRING,
    va_number: DataTypes.STRING,
    transaction_time: DataTypes.DATE,
    expiry_time: DataTypes.DATE,
    payment_code: DataTypes.STRING,
    store: DataTypes.STRING,
    type_status: DataTypes.STRING,
    metadata: DataTypes.TEXT,
    link_payment: DataTypes.STRING,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'payments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return payments;
};