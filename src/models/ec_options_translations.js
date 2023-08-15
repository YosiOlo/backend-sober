'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_options_translations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_options_translations.belongsTo(models.ec_options, { foreignKey: 'ec_options_id', as: 'option' });
    }
  }
  ec_options_translations.init({
    lang_code: DataTypes.STRING,
    ec_options_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_options_translations',
  });
  return ec_options_translations;
};