const {ec_orders, Sequelize} = require('../models');
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

    async getVendor(req, res) {
        const vendorId = req.user.id
        page = req.query.page || 1;
        limit = req.query.limit || 20;
        offset = (page - 1) * limit;

        try {
            const trans = await ec_orders.findAndCountAll({
                where: {customer_id: vendorId},
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
    }
}