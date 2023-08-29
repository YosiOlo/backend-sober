'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_reviews.belongsTo(models.ec_products, {foreignKey: 'product_id', as: 'product'})
    }
  }
  ec_reviews.init({
    customer_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    star: DataTypes.DOUBLE,
    comment: DataTypes.TEXT,
    status: DataTypes.STRING,
    images: DataTypes.TEXT,
    is_reply: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_reviews',
    timestamps: false,
  });
  return ec_reviews;
};