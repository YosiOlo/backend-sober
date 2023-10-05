'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_label_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_product_label_products.belongsTo(models.ec_product_labels, { foreignKey: 'product_label_id', as: 'deflabel' });
      ec_product_label_products.belongsTo(models.ec_products, { foreignKey: 'product_id', as: 'product_labels' });
    }
  }
  ec_product_label_products.init({
    product_label_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'ec_product_label_products',
    timestamps: false,
  });
  return ec_product_label_products;
};