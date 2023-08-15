'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_customer_recently_viewed_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_customer_recently_viewed_product.belongsTo(models.ec_customer, { foreignKey: 'customer_id', as: 'customer' });
    }
  }
  ec_customer_recently_viewed_product.init({
    customer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_customer_recently_viewed_product',
    timestamps: false
  });
  return ec_customer_recently_viewed_product;
};