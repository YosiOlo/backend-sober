'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meta_boxes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  meta_boxes.init({
    meta_key: DataTypes.STRING,
    meta_value: DataTypes.TEXT,
    reference_id: DataTypes.INTEGER,
    reference_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'meta_boxes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return meta_boxes;
};