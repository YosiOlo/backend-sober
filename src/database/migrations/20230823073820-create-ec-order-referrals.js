'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_order_referrals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ip: {
        type: Sequelize.STRING
      },
      landing_domain: {
        type: Sequelize.STRING
      },
      landing_page: {
        type: Sequelize.STRING
      },
      landing_params: {
        type: Sequelize.STRING
      },
      referral: {
        type: Sequelize.STRING
      },
      gclid: {
        type: Sequelize.STRING
      },
      fclid: {
        type: Sequelize.STRING
      },
      utm_source: {
        type: Sequelize.STRING
      },
      utm_campaign: {
        type: Sequelize.STRING
      },
      utm_medium: {
        type: Sequelize.STRING
      },
      utm_term: {
        type: Sequelize.STRING
      },
      utm_content: {
        type: Sequelize.STRING
      },
      referrer_url: {
        type: Sequelize.TEXT
      },
      referrer_domain: {
        type: Sequelize.STRING
      },
      order_id: {
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
    await queryInterface.dropTable('ec_order_referrals');
  }
};