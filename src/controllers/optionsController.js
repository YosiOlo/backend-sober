const {ec_options, Sequelize} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async getOptions(req, res) {
        try {
            const options = await ec_options.findAll({
                where: {
                    is_active: true
                }
            });

            return res.status(200).json({options});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }
};