'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_global_option_value extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_global_option_value.belongsTo(models.ec_global_options, { foreignKey: 'option_id' });
    }
  }
  ec_global_option_value.init({
    option_id: DataTypes.INTEGER,
    option_value: DataTypes.STRING,
    affect_price: DataTypes.DOUBLE,
    order: DataTypes.INTEGER,
    affect_type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_global_option_value',
    tableName: 'ec_global_option_value',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_global_option_value;
};