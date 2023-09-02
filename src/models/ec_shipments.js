'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_shipments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_shipments.belongsTo(models.ec_orders, { foreignKey: 'order_id', as: 'order_shipments'})
    }
  }
  ec_shipments.init({
    order_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    weight: DataTypes.DOUBLE,
    shipment_id: DataTypes.STRING,
    rate_id: DataTypes.STRING,
    note: DataTypes.STRING,
    status: DataTypes.STRING,
    cod_amount: DataTypes.DOUBLE,
    cod_status: DataTypes.STRING,
    cross_checking_status: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    store_id: DataTypes.INTEGER,
    tracking_id: DataTypes.STRING,
    shipping_company_name: DataTypes.STRING,
    tracking_link: DataTypes.STRING,
    estimate_date_shipped: DataTypes.DATE,
    date_shipped: DataTypes.DATE,
    label_url: DataTypes.TEXT,
    metadata: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ec_shipments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_shipments;
};