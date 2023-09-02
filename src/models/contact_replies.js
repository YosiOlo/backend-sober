'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contact_replies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      contact_replies.belongsTo(models.contacts, { foreignKey: 'contact_id', as: 'contact' })
    }
  }
  contact_replies.init({
    message: DataTypes.TEXT,
    contact_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'contact_replies',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return contact_replies;
};