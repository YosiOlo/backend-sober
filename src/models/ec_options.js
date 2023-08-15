'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_options extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_options.hasOne(models.ec_options_translations, { foreignKey: 'option_id', as: 'translation' });
    }
  }
  ec_options.init({
    name: DataTypes.STRING,
    option_type: DataTypes.STRING,
    product_id: DataTypes.BIGINT,
    order: DataTypes.INTEGER,
    required: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ec_options',
  });
  return ec_options;
};