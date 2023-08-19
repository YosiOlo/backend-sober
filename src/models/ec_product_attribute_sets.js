'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_attribute_sets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ec_product_attribute_sets.init({
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    display_layout: DataTypes.STRING,
    is_searchable: DataTypes.BOOLEAN,
    is_comparable: DataTypes.BOOLEAN,
    is_use_in_product_listing: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    order: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    use_image_from_product_variation: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ec_product_attribute_sets',
  });
  return ec_product_attribute_sets;
};