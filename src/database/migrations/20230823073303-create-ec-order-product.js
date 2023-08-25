'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_order_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      tax_amount: {
        type: Sequelize.DECIMAL
      },
      options: {
        type: Sequelize.TEXT
      },
      product_options: {
        type: Sequelize.TEXT
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      product_name: {
        type: Sequelize.STRING
      },
      product_image: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.DOUBLE
      },
      restock_quantity: {
        type: Sequelize.INTEGER
      },
      product_type: {
        type: Sequelize.STRING
      },
      times_downloaded: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('ec_order_products');
  }
};