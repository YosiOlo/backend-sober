'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class media_files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  media_files.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    folder_id: DataTypes.INTEGER,
    mime_type: DataTypes.STRING,
    size: DataTypes.INTEGER,
    url: DataTypes.STRING,
    options: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'media_files',
  });
  return media_files;
};