'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      etalase: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      content: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      images: {
        type: Sequelize.TEXT
      },
      sku: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      allow_checkout_when_out_of_stock: {
        type: Sequelize.BOOLEAN
      },
      with_storehouse_management: {
        type: Sequelize.BOOLEAN
      },
      is_featured: {
        type: Sequelize.BOOLEAN
      },
      brand_id: {
        type: Sequelize.INTEGER
      },
      is_variation: {
        type: Sequelize.BOOLEAN
      },
      sale_type: {
        type: Sequelize.INTEGER
      },
      hpp: {
        type: Sequelize.DOUBLE
      },
      fee: {
        type: Sequelize.DOUBLE
      },
      price: {
        type: Sequelize.DOUBLE
      },
      sale_price: {
        type: Sequelize.DOUBLE
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      length: {
        type: Sequelize.DOUBLE
      },
      wide: {
        type: Sequelize.DOUBLE
      },
      height: {
        type: Sequelize.DOUBLE
      },
      weight: {
        type: Sequelize.DOUBLE
      },
      tax_id: {
        type: Sequelize.INTEGER
      },
      views: {
        type: Sequelize.BIGINT
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      stock_status: {
        type: Sequelize.STRING
      },
      created_by_id: {
        type: Sequelize.INTEGER
      },
      created_by_type: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      product_type: {
        type: Sequelize.STRING
      },
      barcode: {
        type: Sequelize.STRING
      },
      cost_per_item: {
        type: Sequelize.DOUBLE
      },
      store_id: {
        type: Sequelize.INTEGER
      },
      approved_by: {
        type: Sequelize.INTEGER
      },
      kategori1: {
        type: Sequelize.STRING
      },
      kategori2: {
        type: Sequelize.STRING
      },
      kategori3: {
        type: Sequelize.STRING
      },
      terjual: {
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
    await queryInterface.dropTable('ec_products');
  }
};