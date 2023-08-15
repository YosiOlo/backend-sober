'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_customer_pakets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      code: {
        type: Sequelize.BIGINT
      },
      id_paket: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      is_active: {
        type: Sequelize.INTEGER
      },
      is_promo: {
        type: Sequelize.STRING
      },
      promo_percent: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      expire_date: {
        type: Sequelize.DATE
      },
      expire_promo: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('ec_customer_pakets');
  }
};