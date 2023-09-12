'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mp_vendor_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mp_vendor_info.init({
    customer_id: DataTypes.INTEGER,
    balance: DataTypes.DECIMAL,
    total_fee: DataTypes.DECIMAL,
    total_revenue: DataTypes.DECIMAL,
    signature: DataTypes.STRING,
    bank_info: DataTypes.TEXT,
    payout_payment_method: DataTypes.STRING,
    tax_info: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'mp_vendor_info',
    tableName: 'mp_vendor_info',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return mp_vendor_info;
};