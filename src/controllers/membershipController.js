const {ec_paket_master} = require('../models')

module.exports = {
    async listPaket (req, res) {
        try {
            const paket = await ec_paket_master.findAll({
                attributes: {
                    exclude: ['created_at', 'updated_at']
                }
            })
            res.status(200).send({
                status: 200,
                message: 'success get membership tier',
                data: paket
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                status: 500,
                message: 'internal server error'
            })
        }
    }
}