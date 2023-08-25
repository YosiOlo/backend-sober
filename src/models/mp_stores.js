'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mp_stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      mp_stores.hasMany(models.ec_products, {foreignKey: 'store_id',})
    }
  }
  mp_stores.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    logo: DataTypes.STRING,
    description: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: DataTypes.STRING,
    vendor_verified_at: DataTypes.DATE,
    zip_code: DataTypes.STRING,
    company: DataTypes.STRING,
    kelurahan: DataTypes.STRING,
    kecamatan: DataTypes.STRING,
    idktp: DataTypes.STRING,
    ktp: DataTypes.STRING,
    covers: DataTypes.STRING,
    is_active: DataTypes.INTEGER,
    last_active: DataTypes.DATE,
    origin_shipment: DataTypes.STRING,
    branch_shipment: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'mp_stores',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return mp_stores;
};