'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_shipments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.DOUBLE
      },
      shipment_id: {
        type: Sequelize.STRING
      },
      rate_id: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      cod_amount: {
        type: Sequelize.DOUBLE
      },
      cod_status: {
        type: Sequelize.STRING
      },
      cross_checking_status: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      store_id: {
        type: Sequelize.INTEGER
      },
      tracking_id: {
        type: Sequelize.STRING
      },
      shipping_company_name: {
        type: Sequelize.STRING
      },
      tracking_link: {
        type: Sequelize.STRING
      },
      estimate_date_shipped: {
        type: Sequelize.DATE
      },
      date_shipped: {
        type: Sequelize.DATE
      },
      label_url: {
        type: Sequelize.TEXT
      },
      metadata: {
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
    await queryInterface.dropTable('ec_shipments');
  }
};