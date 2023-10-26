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
    ec_customer,
    mp_vendor_info,
    mp_customer_revenues
} = require('../models');
const Op = Sequelize.Op;
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {

    //admin 
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

    async destroy(req, res) {
        const {transId} = req.params

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

    //user

    async getUser(req, res) {
        const userId = req.user.id
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        offset = (page - 1) * limit;

        try {
            const trans = await ec_orders.findAndCountAll({
                where: {
                    user_id: userId
                },
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

    async getUserWaiting(req, res) {
        const userId = req.user.id;

        try {
            const waiting = await ec_orders.findAndCountAll({
                where: {
                    [Op.and]: [
                        {user_id: userId},
                        {
                            '$payment_order.status$': 'pending'
                        }
                    ]
                },
                include: ['order_addresses','order_histories', 'order_product', 'order_referrals', 'order_returns', 'payment_order']
            });
            
            if(waiting.count === 0){
                return res.status(404).json({message: 'Waiting Payment Not Found', status: 404});
            }else{
                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Waiting Payment',
                    data: waiting
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },

    //vendor
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
                include: ['order_addresses', 'payment_order']
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

    async getVendorById(req, res) {
        const vendorId = req.user.dataValues.store.dataValues.id;
        const id = req.params.id;

        try {
            const trans = await ec_orders.findOne({
                where: {
                    [Op.and]: [
                        {store_id: vendorId},
                        {id: id}
                    ]
                },
                include: ['order_addresses','order_histories', 'order_product', 'order_referrals', 'order_returns', 'payment_order', {
                    model: ec_customer,
                    as: 'customer_order',
                    attributes: ['avatar']
                }, {
                    model: ec_shipments,
                    as: 'order_shipments',
                    attributes: ['id','status','tracking_id','tracking_link','created_at'],
                }]
            });

            if(!trans) {
                return res.status(404).json({message: 'Transaction Not Found', status: 404});
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Transaction By Id',
                    data: trans
                });
            }
        } catch (error) {
            return res.status(500).json({status: 500, message: error.message});
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

    async orderReturnById(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {id} = req.params;

        try {
            const returns = await ec_order_returns.findOne({
                where: {
                    store_id: storeId,
                    id: id
                },
                include: [{
                    model: ec_orders,
                    include: [{
                        model: ec_customer,
                        as: 'customer_order',
                        attributes: ['name','email','phone','avatar'],
                    },'order_product',{
                        model: ec_order_addresses,
                        as: 'order_addresses',
                        attributes: ['address','city','state','zip_code']
                    }]
                }, 'return_items']
            });
            
            if(!returns) {
                return res.status(404).json({message: 'Return Not Found', status: 404});
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Returns By Id',
                    data: returns
                });
            }

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
            const revenue = await ec_orders.findAndCountAll({
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

    async vendorRevenueHistory(req, res) {
        const userId = req.user.id

        try {
            const revenue = await mp_customer_revenues.findAndCountAll({
                where: {
                    customer_id: userId
                },
            });

            if (revenue === null) {
                return res.status(404).json({message: 'Revenue Not Found', status: 404});
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Revenue History',
                    data: revenue
                });
            }
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

    async vendorAddWithdrawal(req, res) {
        const customerId = req.user.id;
        const {
            amount, 
            bank_info,
            currency,
            description,
            payment_channel
        } = req.body;

        try {
            //check balance
            const vendor = await mp_vendor_info.findOne({
                where: {
                    customer_id: customerId
                }
            });

            if (vendor === null) {
                return res.status(404).json({message: 'Unauthorized vendor', status: 404});
            } else {
                if (vendor.balance < amount) {
                    return res.status(400).json({message: 'Balance Not Enough', status: 400});
                }
            }

            const withdrawal = await member_withdrawal.create({
                customer_id: customerId,
                current_balance: vendor.balance,
                currency,
                amount,
                bank_info,
                payment_channel,
                description,
                user_id: 1,
                status: 'pending',
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Add Withdrawal',
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
    },

    async updateVendorReturn (req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {returnId} = req.params
        const {status} = req.body

        //check product is vendor product
        try {
            const order = await ec_order_returns.findOne({
                where: {
                    [Op.and]: [
                        {store_id: storeId},
                        {id: returnId}
                    ]
                }
            });

            if (order === null) {
                return res.status(404).json({message: 'Return Not Found / Unauthorized vendor return', status: 404});
            } else {
                //update relation
                await ec_order_returns.update({
                    return_status: status
                }, {
                    where: {
                        id: returnId
                    }
                });

                return res.status(200).json({message: 'Success Update Return', status: 200});
            }
        } catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },

    async destroyVendorReturn (req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {returnId} = req.params

        //check product is vendor product
        try {
            const order = await ec_order_returns.findOne({
                where: {
                    [Op.and]: [
                        {store_id: storeId},
                        {id: returnId}
                    ]
                }
            });

            if (order === null) {
                return res.status(404).json({message: 'Return Not Found / Unauthorized vendor return', status: 404});
            } else {
                //destroy relation
                await ec_order_returns.destroy({
                    where: {
                        id: returnId
                    }
                });

                return res.status(200).json({message: 'Success Delete Return', status: 200});
            }
        } catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },

    async destroyVendorWithdrawal (req, res) {
        const userId = req.user.id
        const {withdrawalId} = req.params

        try {
            //check data
            const withdrawal = await member_withdrawal.findOne({
                where: {
                    [Op.and]: [
                        {customer_id: userId},
                        {id: withdrawalId}
                    ]
                }
            });

            if (withdrawal === null) {
                return res.status(404).json({message: 'Withdrawal Not Found / Unauthorized withdrawal', status: 404});
            } else {
                await member_withdrawal.destroy({
                    where: {
                        id: withdrawalId
                    }
                });

                return res.status(200).json({message: 'Success Delete Withdrawal', status: 200});
            }
        }
        catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },
}