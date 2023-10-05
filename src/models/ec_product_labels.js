'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_labels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_product_labels.hasOne(models.ec_product_label_products, { foreignKey: 'product_label_id', as: 'deflabel' });
    }
  }
  ec_product_labels.init({
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_product_labels',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return ec_product_labels;
};