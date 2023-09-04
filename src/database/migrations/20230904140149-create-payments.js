'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currency: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      charge_id: {
        type: Sequelize.STRING
      },
      payment_channel: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      payment_type: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      refunded_amount: {
        type: Sequelize.DECIMAL
      },
      refund_note: {
        type: Sequelize.STRING
      },
      customer_type: {
        type: Sequelize.STRING
      },
      bank: {
        type: Sequelize.STRING
      },
      va_number: {
        type: Sequelize.STRING
      },
      transaction_time: {
        type: Sequelize.DATE
      },
      expiry_time: {
        type: Sequelize.DATE
      },
      payment_code: {
        type: Sequelize.STRING
      },
      store: {
        type: Sequelize.STRING
      },
      type_status: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.TEXT
      },
      link_payment: {
        type: Sequelize.STRING
      },
      notes: {
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
    await queryInterface.dropTable('payments');
  }
};