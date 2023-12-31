'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_products.belongsTo(models.ec_product_categories1, {foreignKey: 'kategori1', as: 'kategori_1'});
      ec_products.belongsTo(models.ec_product_categories2, {foreignKey: 'kategori2', as: 'kategori_2'});
      ec_products.belongsTo(models.ec_product_categories3, {foreignKey: 'kategori3', as: 'kategori_3'});
      ec_products.belongsTo(models.mp_stores, {foreignKey: 'store_id', as: 'store'});
      ec_products.belongsTo(models.ec_brands, {foreignKey: 'brand_id', as: 'brand'});
      ec_products.hasOne(models.ec_reviews, {foreignKey: 'product_id', as: 'reviews'});
      ec_products.hasMany(models.ec_carts, {foreignKey: 'product_id', as: 'carts'});
      ec_products.hasMany(models.ec_wish_lists, {foreignKey: 'product_id', as: 'wish_lists'});
      ec_products.hasMany(models.ec_product_related_relations, {foreignKey: 'from_product_id', as: 'related_products'});
      ec_products.hasMany(models.ec_product_cross_sale_relations, {foreignKey: 'from_product_id', as: 'cross_sale_products'});
      ec_products.hasMany(models.ec_product_variations, {foreignKey: 'configurable_product_id', as: 'product_variations'});
      ec_products.hasMany(models.ec_product_with_attribute_set, {foreignKey: 'product_id', as: 'product_attribute_set'});
      ec_products.hasOne(models.ec_product_label_products, {foreignKey: 'product_id', as: 'product_labels'});
    }
  }
  ec_products.init({
    name: DataTypes.STRING,
    etalase: DataTypes.STRING,
    description: DataTypes.TEXT,
    content: DataTypes.TEXT,
    status: DataTypes.STRING,
    images: DataTypes.TEXT,
    sku: DataTypes.STRING,
    order: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    allow_checkout_when_out_of_stock: DataTypes.BOOLEAN,
    with_storehouse_management: DataTypes.BOOLEAN,
    is_featured: DataTypes.BOOLEAN,
    brand_id: DataTypes.INTEGER,
    is_variation: DataTypes.BOOLEAN,
    sale_type: DataTypes.INTEGER,
    hpp: DataTypes.DOUBLE,
    fee: DataTypes.DOUBLE,
    price: DataTypes.DOUBLE,
    sale_price: DataTypes.DOUBLE,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    length: DataTypes.DOUBLE,
    wide: DataTypes.DOUBLE,
    height: DataTypes.DOUBLE,
    weight: DataTypes.DOUBLE,
    tax_id: DataTypes.INTEGER,
    views: DataTypes.BIGINT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    stock_status: DataTypes.STRING,
    created_by_id: DataTypes.INTEGER,
    created_by_type: DataTypes.STRING,
    image: DataTypes.STRING,
    product_type: DataTypes.STRING,
    barcode: DataTypes.STRING,
    cost_per_item: DataTypes.DOUBLE,
    store_id: DataTypes.INTEGER,
    approved_by: DataTypes.INTEGER,
    kategori1: DataTypes.STRING,
    kategori2: DataTypes.STRING,
    kategori3: DataTypes.STRING,
    terjual: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ec_products',
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });
  return ec_products;
};