'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_customer_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_customer_address.belongsTo(models.ec_customer, { foreignKey: 'customer_id', as: 'customer' });
    }
  }
  ec_customer_address.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    is_default: DataTypes.BOOLEAN,
    zip_code: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_customer_address',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_customer_address;
};