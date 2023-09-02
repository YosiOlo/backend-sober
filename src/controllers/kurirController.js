const {jne_branchs, jne_destinations, jne_origins, Sequelize} = require('../models')
const Op = Sequelize.Op

module.exports = {
    async listBranchs(req, res) {
        page = req.query.page ? req.query.page : 1
        limit = req.query.limit ? req.query.limit : 10
        offset = (page - 1) * limit
        search = req.query.search ? req.query.search : ''

        try {
            const branchs = await jne_branchs.findAndCountAll({
                where: {
                    branch_name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
            res.status(200).send({
                message: 'success',
                status: 200,
                data: branchs
            })
        }
        catch (err) {
            res.status(500).send({
                error: err
            })
        }
    },

    async listOrigins(req, res) {
        page = req.query.page ? req.query.page : 1
        limit = req.query.limit ? req.query.limit : 10
        offset = (page - 1) * limit
        search = req.query.search ? req.query.search : ''

        try {
            const origins = await jne_origins.findAndCountAll({
                where: {
                    origin_name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
            res.status(200).send({
                message: 'success',
                status: 200,
                data: origins
            })
        }
        catch (err) {
            res.status(500).send({
                error: err
            })
        }
    },

    async listDestinations(req, res) {
        page = req.query.page ? req.query.page : 1
        limit = req.query.limit ? req.query.limit : 10
        offset = (page - 1) * limit
        search = req.query.search ? req.query.search : ''

        try {
            const destinations = await jne_destinations.findAndCountAll({
                where: {
                    destination_name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
            res.status(200).send({
                message: 'success',
                status: 200,
                data: destinations
            })
        }
        catch (err) {
            res.status(500).send({
                error: err
            })
        }
    }
}