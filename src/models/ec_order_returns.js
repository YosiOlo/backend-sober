'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_order_returns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_order_returns.belongsTo(models.ec_orders, { foreignKey: 'order_id' });
    }
  }
  ec_order_returns.init({
    code: DataTypes.STRING,
    order_id: DataTypes.INTEGER,
    store_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    order_status: DataTypes.STRING,
    return_status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_order_returns',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ec_order_returns;
};