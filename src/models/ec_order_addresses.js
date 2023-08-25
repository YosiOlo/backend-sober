'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_order_addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_order_addresses.belongsTo(models.ec_orders, { foreignKey: 'order_id' });
    }
  }
  ec_order_addresses.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    order_id: DataTypes.INTEGER,
    zip_code: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_order_addresses',
    timestamps: false
  });
  return ec_order_addresses;
};