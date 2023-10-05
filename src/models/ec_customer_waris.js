'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_customer_waris extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_customer_waris.belongsTo(models.ec_customer, {foreignKey: 'customer_id'})
    }
  }
  ec_customer_waris.init({
    customer_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    idktp: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    alamat: DataTypes.TEXT,
    provinsi: DataTypes.STRING,
    kota: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    is_same_ktp: DataTypes.BOOLEAN,
    tg_alamat: DataTypes.TEXT,
    tg_provinsi: DataTypes.STRING,
    tg_kota: DataTypes.STRING,
    tg_kecamatan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_customer_waris',
    timestamps: false
  });
  return ec_customer_waris;
};