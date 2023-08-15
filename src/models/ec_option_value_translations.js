'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_option_value_translations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_option_value_translations.init({
    lang_code: DataTypes.STRING,
    ec_option_value_id: DataTypes.INTEGER,
    option_value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_option_value_translations',
  });
  return ec_option_value_translations;
};