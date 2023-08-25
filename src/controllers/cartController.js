const {ec_carts, Sequelize} = require('../models');
const Op = Sequelize.Op;
const {body , validationResult} = require('express-validator');
// const {getCartTotal} = require('../helpers/cartHelper');

module.exports = {
    async indexUser(req, res) {
        try {
            const cart = await ec_carts.findAll({
                where: {
                    customer_id: req.user.id,
                    is_buynow: 0
                },
                // include: [s
                //     {
                //         model: ec_cart,
                //         as: 'product',
                //         attributes: ['id', 'name', 'price', 'image', 'slug']
                //     }
                // ]
            });
            res.status(200).json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    },

    async indexBuyNow(req, res) {
        try {
            const cart = await ec_carts.findAll({
                where: {
                    customer_id: req.user.id,
                    is_buynow: 1
                },
                // include: [
                //     {
                //         model: ec_cart,
                //         as: 'product',
                //         attributes: ['id', 'name', 'price', 'image', 'slug']
                //     }
                // ]
            });
            res.status(200).json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    },

    async store(req, res) {
        try {
            const {id} = req.user
     
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    },

    async update(req, res) {
        try {
            const cart = await ec_carts.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    },

    async destroy(req, res) {
        try {
            const cart = await ec_carts.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json({
                status: 'success',
                data: cart
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error
            });
        }
    }
}