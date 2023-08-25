'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      shipping_option: {
        type: Sequelize.STRING
      },
      shipping_method: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      tax_amount: {
        type: Sequelize.DECIMAL
      },
      shipping_amount: {
        type: Sequelize.DECIMAL
      },
      description: {
        type: Sequelize.TEXT
      },
      coupon_code: {
        type: Sequelize.STRING
      },
      discount_amount: {
        type: Sequelize.DECIMAL
      },
      sub_total: {
        type: Sequelize.DECIMAL
      },
      is_confirmed: {
        type: Sequelize.BOOLEAN
      },
      discount_description: {
        type: Sequelize.STRING
      },
      is_finished: {
        type: Sequelize.BOOLEAN
      },
      completed_at: {
        type: Sequelize.DATE
      },
      token: {
        type: Sequelize.STRING
      },
      payment_id: {
        type: Sequelize.INTEGER
      },
      store_id: {
        type: Sequelize.INTEGER
      },
      shipping_service: {
        type: Sequelize.STRING
      },
      id_paket: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ec_orders');
  }
};