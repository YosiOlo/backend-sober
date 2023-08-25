'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jne_branchs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jne_branchs.init({
    branch_code: DataTypes.STRING,
    branch_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jne_branchs',
    timestamps: false
  });
  return jne_branchs;
};