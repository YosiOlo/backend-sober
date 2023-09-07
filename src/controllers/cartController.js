const {ec_carts, Sequelize, ec_product_attributes, ec_products} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async cartUser (req, res) {
        const userId = req.user.id;
        try {
            const cart = await ec_carts.findAll({
                where: {
                    customer_id: userId,
                }
            });
            if (!cart) {
                return res.status(404).json({message: 'cart not found'});
            } else {
                res.status(200).json({message: 'success get cart data', data: cart});
            }
        }
        catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    async addCart (req, res) {
        const userId = req.user.id;
        const product_id = req.params.id;
        const {qty, attributes, options, is_buynow} = req.body;
        try {
            //check attribute exist
            const attribute = await ec_product_attributes.findOne({
                where: {
                    id: attributes,
                }
            });
            if (!attribute) {
                return res.status(404).json({message: 'failed add cart, attribute not found'});
            }
            //check product exist
            try {
                const product = await ec_products.findOne({
                    where: {
                        id: product_id,
                        stock_status: 'in_stock',
                    }
                });
                if (!product) {
                    return res.status(404).json({message: 'failed add cart, product not found / empty stock'});
                }
                if (product.stock < qty) {
                    return res.status(404).json({message: 'failed add cart, stock not enough'});
                }
            } catch (err) {
                res.status(500).json({message: err.message});
            }
            const cart = await ec_carts.create({
                customer_id: userId,
                product_id,
                qty,
                attributes,
                options,
                is_buynow
            });
            if (!cart) {
                return res.status(401).json({message: 'fail create cart'});
            } else {
                res.status(201).json({message: 'success add cart', data: cart});
            }
        }
        catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    async deleteCart (req, res) {
        const userId = req.user.id;
        const cartId = req.params.id;

        //check user owned cart
        try {
            const cart = await ec_carts.findOne({
                where: {
                    customer_id: userId,
                    id: cartId
                }
            });
            if (!cart) {
                return res.status(404).json({message: 'cart not found'});
            } else {
                await cart.destroy();
                res.status(200).json({message: 'success delete cart'});
            }
        }
        catch (err) {
            res.status(500).json({message: err.message});
        }
    },

    async updateCart (req, res) {
        const cartId = req.params.id;
        const userId = req.user.id;

        //check user owned cart
        try {
            const cart = await ec_carts.findOne({
                where: {
                    customer_id: userId,
                    id: cartId
                }
            });
            if (!cart) {
                return res.status(404).json({message: 'cart not found'});
            } else {
                const qty = req.body.qty ? req.body.qty : cart.qty;
                const is_buynow = req.body.is_buynow ? req.body.is_buynow : cart.is_buynow;
                await cart.update({
                    qty,
                    is_buynow
                });
                res.status(200).json({message: 'success update cart', data: cart});
            }
        }
        catch (err) {
            res.status(500).json({message: err.message});
        }
    },
}