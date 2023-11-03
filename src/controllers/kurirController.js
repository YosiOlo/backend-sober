const {jne_branchs, jne_destinations, jne_origins, Sequelize} = require('../models')
const Op = Sequelize.Op
const axios = require('axios')

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
            console.log(err)
            res.status(500).send({
                message: 'internal server error',
                status: 500,
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
                attributes: {
                    exclude: ['id']
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
            console.log(err)
            res.status(500).send({
                message: 'internal server error',
                status: 500,
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
                    city_name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                limit: parseInt(limit),
                attributes: {
                    exclude: ['id']
                },
                offset: parseInt(offset)
            })
            res.status(200).send({
                message: 'success',
                status: 200,
                data: destinations
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).send({
                message: 'internal server error',
                status: 500,
            })
        }
    },

    async checkOngkir(req, res) {
        try {
            const { 
                origin, 
                destination, 
                weight 
            } = req.body

            //check body
            if (!origin || !destination || !weight) {
                return res.status(400).send({
                    message: 'please fill all required field'
                })
            }

            const ongkir = await axios.post('https://api.rajaongkir.com/starter/cost', {
                origin: origin,
                destination: destination,
                weight: weight,
                courier: 'jne'
            }, {
                headers: {
                    key: process.env.ONGKIR_KEY,
                }
            })
            res.status(200).send({
                message: 'success check ongkir',
                status: 200,
                data: ongkir.data.rajaongkir
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).send({
                message: 'error check ongkir',
                status: 500,
            })
        }
    },

    async cityRajaOngkir(req, res) {
        try {
            const city = await axios.get('https://api.rajaongkir.com/starter/city', {
                headers: {
                    key: process.env.ONGKIR_KEY,
                }
            })
            res.status(200).send({
                message: 'success get city',
                status: 200,
                data: city.data.rajaongkir.results
            })
        }
        catch (err) {
            console.log(err)
            res.status(500).send({
                message: 'error get city',
                status: 500,
            })
        }
    }
}