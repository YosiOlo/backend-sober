'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_paket_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_paket_master.hasOne(models.ec_customer, { foreignKey: 'level', as: 'customer_tier' })
    }
  }
  ec_paket_master.init({
    name: DataTypes.STRING,
    nominal: DataTypes.BIGINT,
    image: DataTypes.TEXT,
    description: DataTypes.TEXT,
    fee_commissions: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_paket_master',
    tableName: 'ec_paket_master',
    timestamps: false,
  });
  return ec_paket_master;
};