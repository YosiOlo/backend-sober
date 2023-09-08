'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_wish_lists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_wish_lists.belongsTo(models.ec_products, { foreignKey: 'product_id', as: 'product' })
    }
  }
  ec_wish_lists.init({
    customer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_wish_lists',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ec_wish_lists;
};