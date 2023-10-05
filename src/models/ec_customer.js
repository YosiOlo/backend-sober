'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_customer.hasMany(models.ec_customer_address, { foreignKey: 'customer_id', as: 'customer_address' });
      ec_customer.hasMany(models.ec_customer_password_reset, { foreignKey: 'email', as: 'customer_password_reset' });
      ec_customer.hasMany(models.ec_customer_paket, { foreignKey: 'user_id', as: 'customer_paket' });
      ec_customer.hasMany(models.ec_customer_recently_viewed_product, { foreignKey: 'customer_id', as: 'customer_recently_viewed_product' });
      ec_customer.hasOne(models.mp_stores, { foreignKey: 'customer_id', as: 'store' });
      ec_customer.hasMany(models.ec_reviews, { foreignKey: 'customer_id', as: 'customer_review' });
      ec_customer.hasMany(models.ec_orders, { foreignKey: 'user_id', as: 'customer_order' });
      ec_customer.belongsTo(models.ec_paket_master, { foreignKey: 'level', as: 'customer_tier' });
      ec_customer.hasMany(models.member_withdrawal, { foreignKey: 'customer_id', as: 'customer_withdrawal' });
      ec_customer.hasMany(models.ec_customer_waris, { foreignKey: 'customer_id', as: 'customer_waris' });
    }
  }
  ec_customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    dob: DataTypes.DATE,
    phone: DataTypes.STRING,
    remember_token: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    confirmed_at: DataTypes.DATE,
    email_verify_token: DataTypes.STRING,
    status: DataTypes.STRING,
    is_vendor: DataTypes.BOOLEAN,
    vendor_verified_at: DataTypes.DATE,
    parent: DataTypes.STRING,
    level: DataTypes.BIGINT,
    is_active: DataTypes.INTEGER,
    last_active: DataTypes.DATE,
    commissions_referral: DataTypes.STRING,
    commissions_shopping: DataTypes.STRING,
    commissions: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_customer',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_customer;
};