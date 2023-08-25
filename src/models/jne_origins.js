'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jne_origins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jne_origins.init({
    origin_code: DataTypes.STRING,
    origin_name: DataTypes.STRING,
    origin_province: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jne_origins',
    timestamps: false
  });
  return jne_origins;
};