'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ec_customer_waris', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      idktp: {
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.TEXT
      },
      provinsi: {
        type: Sequelize.STRING
      },
      kota: {
        type: Sequelize.STRING
      },
      kecamatan: {
        type: Sequelize.STRING
      },
      is_same_ktp: {
        type: Sequelize.BOOLEAN
      },
      tg_alamat: {
        type: Sequelize.TEXT
      },
      tg_provinsi: {
        type: Sequelize.STRING
      },
      tg_kota: {
        type: Sequelize.STRING
      },
      tg_kecamatan: {
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
    await queryInterface.dropTable('ec_customer_waris');
  }
};