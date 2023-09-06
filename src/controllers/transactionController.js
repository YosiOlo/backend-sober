const {
    ec_orders, 
    ec_order_returns, 
    Sequelize , 
    ec_order_product, 
    member_withdrawal, 
    ec_order_referrals, 
    ec_order_histories, 
    ec_order_addresses,
    ec_shipments,
    ec_shipment_histories,
} = require('../models');
const Op = Sequelize.Op;
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
    async index(req, res) {
        try {
            const {id} = req.params;
            const order = await ec_orders.findByPk(id,{
                include: ['order_addresses','order_histories', 'order_product', 'order_referrals', 'order_returns']
            });
            if (order) {
                return res.json(order);
            } else {
                return res.status(400).json({message: 'Order not found'});
            }
        } catch (error) {
            return res.status(400).json({message: 'Error on get order'});
        }
    },

    async getAll(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 20;
        offset = (page - 1) * limit;

        try {
            const trans = await ec_orders.findAndCountAll({
                limit: parseInt(limit),
                offset: offset,
                order: [
                    ['created_at', 'DESC']
                ],
                include: ['order_addresses','order_histories', 'order_product', 'order_referrals', 'order_returns', 'customer_order']
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Transactions',
                data: trans
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },

    async getVendor(req, res) {
        const vendorId = req.user.dataValues.store.dataValues.id;

        page = req.query.page || 1;
        limit = req.query.limit || 20;
        offset = (page - 1) * limit;

        try {
            const trans = await ec_orders.findAndCountAll({
                where: {store_id: vendorId},
                limit: parseInt(limit),
                offset: offset,
                include: ['order_addresses','order_histories', 'order_product', 'order_referrals', 'order_returns', 'payment_order']
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Transactions',
                data: trans
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },

    async getUser(req, res) {
        const userId = req.user.id
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        offset = (page - 1) * limit;

        try {
            const trans = await ec_orders.findAndCountAll({
                where: {customer_id: userId},
                limit: parseInt(limit),
                offset: offset,
                order: [
                    ['created_at', 'DESC']
                ],
                include: ['order_addresses','order_histories', 'order_product', 'order_referrals', 'order_returns']
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Transactions',
                data: trans
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },

    async destroy(req, res) {
        const {transId} = req.body

        try {
            const trans = await ec_orders.findByPk(transId);
            if (trans === null) {
                return res.status(404).json({message: 'Trans Not Found', status: 404});
            } else {
                await discount.destroy();
                return res.status(200).json({message: 'Success Delete Transaction', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },

    async orderReturn(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;

        page = req.query.page || 1;
        limit = req.query.limit || 20;
        offset = (page - 1) * limit;

        try {
            const returns = await ec_order_returns.findAndCountAll({
                where: {store_id: storeId},
                limit: parseInt(limit),
                offset: offset,
                order: [
                    ['created_at', 'DESC']
                ],
                include: [{
                    model: ec_orders,
                    include: ['customer_order','order_product']
                }]
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Returns',
                data: returns
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }

    },

    async vendorRevenue(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;

        try {
            const revenue = await ec_orders.findAll({
                where: {
                    [Op.and]: [
                        {store_id: storeId},
                        {status: 'completed'}
                    ]
                },
                include: ['customer_order','payment_order']
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Revenue',
                data: revenue
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }

    },

    async vendorWithdrawal(req, res) {
        const userId = req.user.id

        page = req.query.page || 1;
        limit = req.query.limit || 20;
        offset = (page - 1) * limit;

        try {
            const withdrawal = await member_withdrawal.findAndCountAll({
                where: {customer_id: userId},
                limit: parseInt(limit),
                offset: offset,
                order: [
                    ['created_at', 'DESC']
                ]
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Withdrawal',
                data: withdrawal
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },

    async vendorDestroy (req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {transId} = req.params

        //check product is vendor product
        try {
            const order = await ec_orders.findOne({
                where: {
                    [Op.and]: [
                        {store_id: storeId},
                        {id: transId}
                    ]
                }
            });

            if (order === null) {
                return res.status(404).json({message: 'Order Not Found / Unauthorized vendor order', status: 404});
            } else {
                //destroy relation
                await ec_order_product.destroy({
                    where: {
                        order_id: transId
                    }
                });

                await ec_order_returns.destroy({
                    where: {
                        order_id: transId
                    }
                });

                await ec_order_referrals.destroy({
                    where: {
                        order_id: transId
                    }
                });

                await ec_order_histories.destroy({
                    where: {
                        order_id: transId
                    }
                });

                await ec_order_addresses.destroy({
                    where: {
                        order_id: transId
                    }
                });

                await ec_orders.destroy({
                    where: {
                        id: transId
                    }
                });

                return res.status(200).json({message: 'Success Delete Transaction', status: 200});
            }
        } catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },

    async vendorUpdateOrderAddress (req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {transId} = req.params
        let {name, phone, email, state, city, address, zip_code} = req.body

        //check product is vendor product
        try {
            const order = await ec_orders.findOne({
                where: {
                    [Op.and]: [
                        {store_id: storeId},
                        {id: transId}
                    ]
                },
                include: ['order_addresses']
            });

            if (order === null) {
                return res.status(404).json({message: 'Order Not Found / Unauthorized vendor order', status: 404});
            } else {
                if (name.length === 0) {
                    name = order.order_addresses.name
                }
                if (phone.length === 0) {
                    phone = order.order_addresses.phone
                }
                if (email.length === 0) {
                    email = order.order_addresses.email
                }
                if (state.length === 0) {
                    state = order.order_addresses.state
                }
                if (city.length === 0) {
                    city = order.order_addresses.city
                }
                if (address.length === 0) {
                    address = order.order_addresses.address
                }
                if (zip_code.length === 0) {
                    zip_code = order.order_addresses.zip_code
                }

                //update relation
                await ec_order_addresses.update({
                    name,
                    phone,
                    email,
                    state,
                    city,
                    address,
                    zip_code
                }, {
                    where: {
                        order_id: transId
                    }
                });

                return res.status(200).json({message: 'Success Update Transaction Address', status: 200});
            }
        }
        catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },

    async vendorUpdateNote (req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {transId} = req.params
        const {note} = req.body

        //check product is vendor product
        try {
            const order = await ec_orders.findOne({
                where: {
                    [Op.and]: [
                        {store_id: storeId},
                        {id: transId}
                    ]
                }
            });

            if (order === null) {
                return res.status(404).json({message: 'Order Not Found / Unauthorized vendor order', status: 404});
            } else {
                //update relation
                await ec_orders.update({
                    description: note
                }, {
                    where: {
                        id: transId
                    }
                });

                return res.status(200).json({message: 'Success Update Transaction Note', status: 200});
            }
        }
        catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },

    async vendorUpdateShipment (req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {transId} = req.params
        const {shipment_status} = req.body

        //check product is vendor product
        try {
            const order = await ec_orders.findOne({
                where: {
                    [Op.and]: [
                        {store_id: storeId},
                        {id: transId}
                    ]
                }
            });

            if (order === null) {
                return res.status(404).json({message: 'Order Not Found / Unauthorized vendor order', status: 404});
            } else {
                //update relation
                await ec_orders.update({
                    status: shipment_status
                }, {
                    where: {
                        id: transId
                    }
                });

                //check shipment
                const shipment = await ec_shipments.findOne({
                    where: {
                        order_id: transId
                    }
                });

                if (shipment) {
                    await ec_shipments.update({
                        status: shipment_status
                    }, {
                        where: {
                            order_id: transId
                        }
                    });

                    await ec_shipment_histories.create({
                        action: 'update_status',
                        description: `Changed status of shipping to: ${shipment_status}. Updated by: ${req.user.name}`,
                        user_id: shipment.user_id,
                        shipment_id: shipment.id,
                        order_id: transId
                    });
                } 

                return res.status(200).json({message: 'Success Update Transaction Shipment', status: 200});
            }
        }
        catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    }
}