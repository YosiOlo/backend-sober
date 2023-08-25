'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_bank_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_bank_list.init({
    bank_code: DataTypes.STRING,
    bank_holder: DataTypes.STRING,
    bank_nomor: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    bank_name: DataTypes.STRING,
    icons: DataTypes.TEXT,
    fee: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'ec_bank_list',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return ec_bank_list;
};