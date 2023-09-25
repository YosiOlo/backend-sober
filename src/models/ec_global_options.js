'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_global_options extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_global_options.hasMany(models.ec_global_option_value, { foreignKey: 'option_id', as: 'values' });
    }
  }
  ec_global_options.init({
    name: DataTypes.STRING,
    option_type: DataTypes.STRING,
    required: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ec_global_options',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_global_options;
};