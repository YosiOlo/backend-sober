const { parse } = require('dotenv');
const {ec_carts, Sequelize, ec_product_attributes, ec_products} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async cartUser (req, res) {
        const userId = req.user.id;
        try {
            const cart = await ec_carts.findAll({
                where: {
                    customer_id: userId,
                },
                order: [
                    ['created_at', 'DESC']
                ],
                include: [
                    {
                        model: ec_products,
                        as: 'product',
                        attributes : ['id', 'name', 'price', 'stock_status', 'images']
                    },
                ],
            });
            if (!cart) {
                return res.status(404).json({message: 'cart not found'});
            } else {
                let arrays = [];
                cart.map((cart) => {
                    let images = []
                    if (cart.product == null) {
                        arrays.push(cart);
                        return;
                    }
                    if (cart.product.dataValues.images.length == 2) {
                        arrays.push(cart);
                        return;
                    }
                    const split = cart.product.images.split(',').map((image) => {
                        image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                        images.push(image);
                    });
                    arrays.push({
                        ...cart.dataValues,
                        product: {
                            ...cart.product.dataValues,
                            images: images,
                            price: `Rp ${cart.product.dataValues.price.toLocaleString('id-ID')}`,
                            total_price: `Rp ${(cart.product.dataValues.price * cart.qty).toLocaleString('id-ID')}`
                        }
                    });
                });

                res.status(200).json({message: 'success get cart data', data: arrays});
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: "failed get cart data",
            });
        }
    },

    async addCart (req, res) {
        const userId = req.user.id;
        const product_id = req.params.id;
        const {qty, attributes, options, is_buynow} = req.body;
        try {

            //check attribute exist
            // const attribute = await ec_product_attributes.findOne({
            //     where: {
            //         id: attributes,
            //     }
            // });
            // if (!attribute) {
            //     return res.status(404).json({message: 'failed add cart, attribute not found'});
            // }
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
                console.log(err)
                res.status(500).json({
                    message: "failed add cart, product error",
                });
            }

            //check cart exist
            const cartExist = await ec_carts.findOne({
                where: {
                    customer_id: userId,
                    product_id,
                }
            });
            if (cartExist) {
                const qtyUpdate = parseInt(cartExist.qty) + parseInt(qty);
                await cartExist.update({
                    qty: qtyUpdate,
                });
                return res.status(200).json({message: 'success add product to cart', data: cartExist});
            }

            const cart = await ec_carts.create({
                customer_id: userId,
                product_id,
                qty: parseInt(qty),
                attributes,
                options,
                is_buynow
            });
            if (!cart) {
                return res.status(401).json({message: 'fail create cart'});
            } else {
                res.status(201).json({message: 'success add product to cart', data: cart});
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: "failed add cart",
            });
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
            console.log(err)
            res.status(500).json({
                message: "failed delete cart",
            });
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
            console.log(err)
            res.status(500).json({
                message: "failed update cart",
            });
        }
    },
}