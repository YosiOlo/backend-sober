'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class member_withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      member_withdrawal.belongsTo(models.ec_customer, { foreignKey: 'customer_id' });
    }
  }
  member_withdrawal.init({
    customer_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    current_balance: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    description: DataTypes.TEXT,
    bank_info: DataTypes.TEXT,
    payment_channel: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    images: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'member_withdrawal',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'member_withdrawal'
  });
  return member_withdrawal;
};