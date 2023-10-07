const {ec_shipments, ec_orders, ec_customer, Sequelize} = require('../models')
const Op = Sequelize.Op

module.exports = {
    async listShipment(req, res) {
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const offset = (page - 1) * limit
        const search = req.query.search || ''

        try {
            const shipments = await ec_shipments.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            shipment_id: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            tracking_id: {
                                [Op.iLike]: `%${search}%`
                            }
                        }
                    ]
                },
                include: ['order_shipments'],
                limit: limit,
                offset: offset
            })

            return res.status(200).json({
                status: 'success',
                data: shipments
            })
        }
        catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            })
        }
    },

    async userShipment(req, res) {
        const user_id = req.user.id

        try {
            const shipments = await ec_shipments.findAll({
                where: {
                    user_id: user_id
                },
                include: [
                    {
                        model: ec_orders,
                        as: 'order_shipments',
                        include: [
                            {
                                model: ec_customer,
                                as: 'customer_order',
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            })

            return res.status(200).json({
                status: 'success',
                data: shipments
            })
        }
        catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            })
        }
    },

    async vendorShipment(req, res) {
        const vendorId = req.user.dataValues.store.dataValues.id

        const limit = req.query.limit || 10
        const page = req.query.page || 1
        const offset = (page - 1) * limit

        try {
            const shipments = await ec_shipments.findAndCountAll({
                where: {
                    store_id: vendorId
                },
                include: [
                    {
                        model: ec_orders,
                        as: 'order_shipments',
                        include: [
                            {
                                model: ec_customer,
                                as: 'customer_order',
                                attributes: ['name']
                            }
                        ]
                    }
                ],
                limit: limit,
                offset: offset
            })

            return res.status(200).json({
                status: 'success',
                data: shipments
            })
        }
        catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            })
        }
    },

    async detailShipment(req, res) {
        const shipmentId = req.params.id

        try {
            const shipment = await ec_shipments.findOne({
                where: {
                    id: shipmentId
                },
                include: [
                    {
                        model: ec_orders,
                        as: 'order_shipments',
                        include: [
                            {
                                model: ec_customer,
                                as: 'customer_order',
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            })

            return res.status(200).json({
                status: 'success',
                data: shipment
            })
        }
        catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            })
        }
    },

    async updateShipment(req, res) {
        const orderId = req.params.id
        const {status} = req.body

        try {
            const shipment = await ec_shipments.findOne({
                where: {
                    order_id: orderId
                }
            })

            if (!shipment) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Shipment not found'
                })
            }

            await shipment.update({
                status: status
            },{
                where: {
                    order_id: orderId
                }
            })

            return res.status(200).json({
                status: 'success update shipment',
                status: 200
            })
        }
        catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            })
        }
    },

    async deleteShipment(req, res) {
        const shipmentId = req.params.id

        try {
            const shipment = await ec_shipments.findOne({
                where: {
                    id: shipmentId
                }
            })

            if (!shipment) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Shipment not found'
                })
            }

            await shipment.destroy()

            return res.status(200).json({
                status: 'success',
                message: 'Shipment deleted'
            })
        }
        catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message
            })
        }
    }
}