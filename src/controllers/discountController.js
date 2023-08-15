const { ec_discount, Sequelize} = require('../models');
const { ById } = require('./currencyController');
const Op = Sequelize.Op;


module.exports = {
    async index(req, res) {
        try {
            const discount = await ec_discount.findAll({
                order: [
                    ['created_at', 'DESC']
                ]
            });
            return res.status(200).json({message: 'Success', status: 200, data: discount});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async ById(req, res) {
        try {
            const discount = await ec_discount.findByPk(req.params.id);
            if (discount === null) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } else {
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async stillValid(req, res) {
        try {
            const discount = await ec_discount.findAll({
                where: {
                    start_date: {
                        [Op.lte]: new Date()
                    },
                    end_date: {
                        [Op.gte]: new Date()
                    }
                },
                order: [
                    ['created_at', 'DESC']
                ]
            });
            return res.status(200).json({message: 'Success', status: 200, data: discount});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
};