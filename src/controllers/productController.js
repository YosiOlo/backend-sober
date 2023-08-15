const {ec_product_categories, ec_products, Sequelize} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async listProductCategories(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;
        try {
            const productCategories = await ec_product_categories.findAndCountAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                },
                limit: +limit,
                offset: +offset
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Product Categories',
                data: productCategories
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

    async listProducts(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;
        try {
            const products = await ec_products.findAndCountAll({
                where: {
                    [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search}%`
                        },
                    },{
                        description: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
                },
                limit: +limit,
                offset: +offset
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Products',
                data: products
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

    async detailProduct(req, res) {
        const {id} = req.params;
        try {
            const product = await ec_products.findOne({
                where: {
                    id: id
                }
            });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found',
                    data: {}
                });
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Product',
                    data: product
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },
}
        