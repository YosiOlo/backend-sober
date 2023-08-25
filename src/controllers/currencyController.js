const { ec_currency, Sequelize} = require('../models');
const Op = Sequelize.Op;


module.exports = {
    async index(req, res) {
        try {
            const currency = await ec_currency.findAll({
                order: [
                    ['title', 'ASC']
                ]
            });
            return res.status(200).json({message: 'Success', data: currency});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async ById(req, res) {
        try {
            const currency = await ec_currency.findByPk(req.params.id);
            if (currency === null) {
                return res.status(404).json({message: 'Currency Not Found', status: 404});
            } else {
                return res.status(200).json({message: 'Success', status: 200 ,data: currency});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },
};
