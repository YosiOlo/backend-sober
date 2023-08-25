'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_order_histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_order_histories.belongsTo(models.ec_orders, { foreignKey: 'order_id' });
    }
  }
  ec_order_histories.init({
    action: DataTypes.STRING,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    extras: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ec_order_histories',
    timestamps: false
  });
  return ec_order_histories;
};