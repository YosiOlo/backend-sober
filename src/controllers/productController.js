const { where } = require('sequelize');
const {
    ec_product_categories, 
    ec_products, 
    Sequelize,
    ec_product_categories1,
    ec_product_categories2,
    ec_product_categories3,
    ec_product_attribute_sets_translations,
    ec_product_attribute_sets,
    ec_product_attributes_translations,
    ec_product_attributes,
    ec_product_categories_translations,
    ec_product_category_product,
    ec_product_etalase,
    ec_product_translations
} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async listProductCategories(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;
        try {
            const productCategories = await ec_product_categories1.findAndCountAll({
                where: {
                    [Op.and] : {
                        name: {
                            [Op.iLike]: `%${search}%`
                        },
                        is_featured: 1         
                    }
                },
                limit: +limit,
                offset: +offset,
                include: [{
                    model: ec_product_categories2,
                    as: 'category_child_1',
                    include: [{
                        model: ec_product_categories3,
                        as: 'category_child_2',
                    }]
                }]
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
                            [Op.iLike]: `%${search}%`
                        },
                    },{
                        description: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                ]
                },
                limit: parseInt(limit),
                offset: offset,
                include: {all: true}
            });
            let arrays = [];
            products.rows.map((product) => {
                let images = []
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                arrays.push({
                    ...product.dataValues,
                    images: images
                });
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Products',
                data: {
                    count: products.count,
                    rows: arrays
                }
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
                },
                include: {all: true}
            });
            if (!product) {
                return res.status(404).json({
                    status: 404,
                    message: 'Product Not Found',
                    data: {}
                });
            } else {
                let images = []
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });

                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Product',
                    data: {
                        ...product.dataValues,
                        images: images
                    }
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

    async deleteProduct(req, res) {
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
                await product.destroy();
                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Product',
                    data: {}
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

    async vendorProducts(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;

        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;

        try {
            const products = await ec_products.findAndCountAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    name: {
                                        [Op.iLike]: `%${search}%`
                                    },
                                },{
                                    description: {
                                        [Op.iLike]: `%${search}%`
                                    }
                                }
                            ]
                        },
                        {
                            store_id: storeId
                        }
                    ]
                },
                include: {all: true},
                limit: parseInt(limit),
                offset: offset
            });
            let arrays = [];
            products.rows.map((product) => {
                let images = []
                const split = product.dataValues.images.split(',').map((image) => {
                    //remove backslash, double quote, and square bracket
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                arrays.push({
                    ...product.dataValues,
                    images: images
                });
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Products',
                data: {
                    count: products.count,
                    rows: arrays
                }
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
}
        