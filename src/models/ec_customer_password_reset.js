'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_customer_password_reset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_customer_password_reset.belongsTo(models.ec_customer, { foreignKey: 'email', as: 'customer' });
    }
  }
  ec_customer_password_reset.init({
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_customer_password_reset',
    timestamps: false
  });
  return ec_customer_password_reset;
};