'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_order_referrals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_order_referrals.belongsTo(models.ec_orders, { foreignKey: 'order_id' });
    }
  }
  ec_order_referrals.init({
    ip: DataTypes.STRING,
    landing_domain: DataTypes.STRING,
    landing_page: DataTypes.STRING,
    landing_params: DataTypes.STRING,
    referral: DataTypes.STRING,
    gclid: DataTypes.STRING,
    fclid: DataTypes.STRING,
    utm_source: DataTypes.STRING,
    utm_campaign: DataTypes.STRING,
    utm_medium: DataTypes.STRING,
    utm_term: DataTypes.STRING,
    utm_content: DataTypes.STRING,
    referrer_url: DataTypes.TEXT,
    referrer_domain: DataTypes.STRING,
    order_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_order_referrals',
    timestamps: false
  });
  return ec_order_referrals;
};