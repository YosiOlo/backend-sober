const {ec_wish_lists, ec_products} = require('../models');

module.exports = {
    async userWishlist(req, res) {
        const userId = req.user.id;

        try {
            const wishlist = await ec_wish_lists.findAll({
                where: {
                    customer_id: userId
                },
                include: {
                    model: ec_products,
                    as: 'product',
                    attributes: ['id', 'name', 'description', 'price', 'sale_price', 'images']
                },
            });
            if (wishlist.length === 0) {
                return res.status(404).json({
                    message: 'Wishlist not found'
                });
            } else {
                let arrays = [];
                wishlist.forEach((item) => {
                    let images = []
                    if (item.product.images === null) {
                        item.product.images = [];
                    }
                    item.product.images.split(',').forEach((image) => {
                        image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                        images.push(image);
                    });
                    arrays.push({
                        ...item.dataValues,
                        product: {
                            ...item.product.dataValues,
                            images: images
                        }
                    });
                });
                return res.status(200).json({
                    message: 'Success get wishlist',
                    data: arrays
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },

    async addWishlist (req, res) {
        const userId = req.user.id;
        const productId = req.params.id;

        try {
            const product = await ec_products.findOne({
                where: {
                    id: productId
                }
            });
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const check = await ec_wish_lists.findOne({
                where: {
                    customer_id: userId,
                    product_id: productId
                }
            });
            if (check) {
                return res.status(400).json({
                    message: 'Product already in wishlist'
                });
            }
            const wishlist = await ec_wish_lists.create({
                customer_id: userId,
                product_id: productId
            });
            if (wishlist) {
                return res.status(200).json({
                    message: 'Success added wishlist',
                    data: wishlist
                });
            } else {
                return res.status(400).json({
                    message: 'Failed to add wishlist'
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },

    async userDelete (req, res) {
        const userId = req.user.id;
        const productId = req.params.id;

        try {
            const wishlist = await ec_wish_lists.findOne({
                where: {
                    customer_id: userId,
                    product_id: productId
                }
            });
            if (!wishlist) {
                return res.status(404).json({
                    message: 'Wishlist not found / Unauthorized'
                });
            }
            const deleted = await wishlist.destroy();
            if (deleted) {
                return res.status(200).json({
                    message: 'Success deleted wishlist',
                    data: wishlist
                });
            } else {
                return res.status(400).json({
                    message: 'Failed to delete wishlist'
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },

    async allWishlist (req, res) {
        try {
            const wishlist = await ec_wish_lists.findAll({
                order: [
                    ['created_at', 'DESC']
                ],
            });
            if (wishlist.length === 0) {
                return res.status(404).json({
                    message: 'Wishlist not found'
                });
            } else {
                return res.status(200).json({
                    message: 'Success get wishlist',
                    data: wishlist
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },

    async deleteWishlist (req, res) {
        const wishlistId = req.params.id;

        try {
            const wishlist = await ec_wish_lists.findOne({
                where: {
                    id: wishlistId
                }
            });
            if (!wishlist) {
                return res.status(404).json({
                    message: 'Wishlist not found'
                });
            }
            const deleted = await wishlist.destroy();
            if (deleted) {
                return res.status(200).json({
                    message: 'Success deleted wishlist',
                    data: wishlist
                });
            } else {
                return res.status(400).json({
                    message: 'Failed to delete wishlist'
                });
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
}