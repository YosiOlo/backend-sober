'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class midtrans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      midtrans.belongsTo(models.ec_orders, { foreignKey: 'order_id' });
    }
  }
  midtrans.init({
    order_id: DataTypes.STRING,
    metadata: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'midtrans',
    tableName: 'midtrans',
    timestamps: false
  });
  return midtrans;
};