'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mp_vendor_infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      balance: {
        type: Sequelize.DECIMAL
      },
      total_fee: {
        type: Sequelize.DECIMAL
      },
      total_revenue: {
        type: Sequelize.DECIMAL
      },
      signature: {
        type: Sequelize.STRING
      },
      bank_info: {
        type: Sequelize.TEXT
      },
      payout_payment_method: {
        type: Sequelize.STRING
      },
      tax_info: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('mp_vendor_infos');
  }
};