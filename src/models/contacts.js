'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      contacts.hasMany(models.contact_replies, { foreignKey: 'contact_id', as: 'replies' })
    }
  }
  contacts.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    subject: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contacts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return contacts;
};