'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ec_product_related_relations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ec_product_related_relations.belongsTo(models.ec_products, { foreignKey: 'from_product_id' });    }
  }
  ec_product_related_relations.init({
    from_product_id: DataTypes.INTEGER,
    to_product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ec_product_related_relations',
    timestamps: false,
  });
  return ec_product_related_relations;
};