'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE
      },
      phone: {
        type: Sequelize.STRING
      },
      remember_token: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      confirmed_at: {
        type: Sequelize.DATE
      },
      email_verify_token: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      is_vendor: {
        type: Sequelize.BOOLEAN
      },
      vendor_verified_at: {
        type: Sequelize.DATE
      },
      parent: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.BIGINT
      },
      is_active: {
        type: Sequelize.INTEGER
      },
      last_active: {
        type: Sequelize.DATE
      },
      commissions_referral: {
        type: Sequelize.STRING
      },
      commissions_shopping: {
        type: Sequelize.STRING
      },
      commissions: {
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
    await queryInterface.dropTable('ec_customers');
  }
};