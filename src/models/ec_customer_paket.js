'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_customer_paket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_customer_paket.belongsTo(models.ec_customer, { foreignKey: 'user_id', as: 'customer' });
    }
  }
  ec_customer_paket.init({
    user_id: DataTypes.BIGINT,
    code: DataTypes.BIGINT,
    id_paket: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    is_active: DataTypes.INTEGER,
    is_promo: DataTypes.STRING,
    promo_percent: DataTypes.STRING,
    status: DataTypes.STRING,
    expire_date: DataTypes.DATE,
    expire_promo: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_customer_paket',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return ec_customer_paket;
};