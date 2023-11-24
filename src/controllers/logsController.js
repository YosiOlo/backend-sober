const {audit_history, Sequelize} = require('../models');
const { destroy } = require('./transactionController');
const Op = Sequelize.Op;

module.exports = {
    async index(req, res) {
        try {
            const search = req.query.search ? req.query.search : '';
            const page = req.query.page ? req.query.page : 1;
            const limit = req.query.limit ? req.query.limit : 10;
            const offset = (page - 1) * limit;

            const logs = await audit_history.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            action: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            type: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            reference_name: {
                                [Op.iLike]: `%${search}`
                            }
                        }]
                },
                limit: limit,
                offset: offset
            })
            return res.status(200).json({
                status: 200,
                message: 'Success Get Logs',
                data: trans
            });
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
            });
        }       
    },

    async destroy(req, res) {
        try {
            const {id} = req.params;
            const log = await audit_history.findByPk(id);
            if (log) {
                await log.destroy();
                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Log',
                    data: log
                });
            } else {
                return res.status(400).json({message: 'Log not found'});
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Error on delete log'
            });
        }
    },

    async bulkDestroy(req, res) {
        try {
            const {ids} = req.body;
            const logs = await audit_history.findAll({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });
            if (logs) {
                await logs.destroy();
                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Logs',
                    data: logs
                });
            } else {
                return res.status(400).json({message: 'Logs not found'});
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Error on delete logs'
            });
        }
    }
}