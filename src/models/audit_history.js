'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class audit_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  audit_history.init({
    user_id: DataTypes.INTEGER,
    module: DataTypes.STRING,
    request: DataTypes.TEXT,
    action: DataTypes.STRING,
    user_agent: DataTypes.TEXT,
    ip_address: DataTypes.STRING,
    reference_user: DataTypes.INTEGER,
    reference_id: DataTypes.INTEGER,
    reference_name: DataTypes.STRING,
    type: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'audit_history',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return audit_history;
};