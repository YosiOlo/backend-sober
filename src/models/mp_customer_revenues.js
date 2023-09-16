'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mp_customer_revenues extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mp_customer_revenues.init({
    customer_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    sub_amount: DataTypes.DECIMAL,
    fee: DataTypes.DECIMAL,
    amount: DataTypes.DECIMAL,
    current_balance: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    id_paket: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'mp_customer_revenues',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return mp_customer_revenues;
};