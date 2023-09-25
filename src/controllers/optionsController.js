const {
    ec_options, 
    ec_option_value,
    ec_global_options,
    ec_global_option_value,
    Sequelize
} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async getOptions(req, res) {
        try {
            const options = await ec_options.findAll({
                include: [
                    {
                        model: ec_option_value,
                        as: 'values',
                        attributes: {
                            exclude: ['created_at', 'updated_at']
                        }
                    }
                ],
                attributes: {
                    exclude: ['created_at', 'updated_at']
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Options',
                data: options
            });
        } catch (e) {
            return res.status(500).json({
                status: 500,
                message: e.message,
                data: []
            });
        }
    },

    async getGlobalOptions(req, res) {
        try {
            const options = await ec_global_options.findAll({
                include: [
                    {
                        model: ec_global_option_value,
                        as: 'values',
                        attributes: {
                            exclude: ['created_at', 'updated_at']
                        }
                    }
                ],
                attributes: {
                    exclude: ['created_at', 'updated_at']
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Global Options',
                data: options
            });
        } catch (e) {
            return res.status(500).json({
                status: 500,
                message: e.message,
                data: []
            });
        }
    }
};