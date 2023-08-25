'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jne_destinations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jne_destinations.init({
    country_name: DataTypes.STRING,
    province_name: DataTypes.STRING,
    city_name: DataTypes.STRING,
    district_name: DataTypes.STRING,
    subdistrict_name: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    tarif_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jne_destinations',
    timestamps: false
  });
  return jne_destinations;
};