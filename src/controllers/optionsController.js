const {
    ec_options, 
    ec_option_value,
    ec_global_options,
    ec_global_option_value,
    ec_product_tags,
    ec_brands,
    Sequelize
} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async getOptions(req, res) {
        try {
            const options = await ec_options.findAll({
                include: [
                    {
                        model: ec_option_value,
                        as: 'values',
                        attributes: {
                            exclude: ['created_at', 'updated_at']
                        }
                    }
                ],
                attributes: {
                    exclude: ['created_at', 'updated_at']
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Options',
                data: options
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async getGlobalOptions(req, res) {
        try {
            const options = await ec_global_options.findAll({
                include: [
                    {
                        model: ec_global_option_value,
                        as: 'values',
                        attributes: {
                            exclude: ['created_at', 'updated_at']
                        }
                    }
                ],
                attributes: {
                    exclude: ['created_at', 'updated_at']
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Global Options',
                data: options
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async listTags(req, res) {
        try {
            const tags = await ec_product_tags.findAll({
                attributes: {
                    exclude: ['created_at', 'updated_at']
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Tags',
                data: tags
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async deleteTags(req, res) {
        try {
            const { id } = req.params;

            const check = await ec_product_tags.findOne({
                where: {
                    id
                }
            });
            if (!check) {
                return res.status(404).json({
                    status: 404,
                    message: 'Tags Not Found / Already Deleted',
                });
            }

            const tags = await ec_product_tags.destroy({
                where: {
                    id
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Delete Tags',
                data: tags
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async addTags(req, res) {
        try {
            const { name, description } = req.body;

            const check = await ec_product_tags.findOne({
                where: {
                    name
                }
            });
            if (check) {
                return res.status(400).json({
                    status: 400,
                    message: 'Tags Already Exist',
                });
            }

            const tags = await ec_product_tags.create({
                name,
                description,
                status: 'published'
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Add Tags',
                data: tags
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async updateTags(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const check = await ec_product_tags.findOne({
                where: {
                    id
                }
            });
            if (!check) {
                return res.status(404).json({
                    status: 404,
                    message: 'Tags Not Found / Already Deleted',
                });
            }

            const tags = await ec_product_tags.update({
                name,
                description,
                status: 'published'
            }, {
                where: {
                    id
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Update Tags',
                data: tags
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async listBrands(req, res) {
        try {
            const brands = await ec_brands.findAll({
                attributes: {
                    exclude: ['created_at', 'updated_at']
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Brands',
                data: brands
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async addBrands(req, res) {
        try {
            const { 
                name, 
                description,
                website,
                is_featured, 
            } = req.body;

            const check = await ec_brands.findOne({
                where: {
                    name
                }
            });
            if (check) {
                return res.status(400).json({
                    status: 400,
                    message: 'Brands Already Exist',
                });
            }

            const brands = await ec_brands.create({
                name,
                description,
                status: 'published',
                website,
                is_featured: is_featured ? is_featured : 0,
                order: 0
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Add Brands',
                data: brands
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    },

    async deleteBrands(req, res) {
        try {
            const { id } = req.params;

            const check = await ec_brands.findOne({
                where: {
                    id
                }
            });
            if (!check) {
                return res.status(404).json({
                    status: 404,
                    message: 'Brands Not Found / Already Deleted',
                });
            }

            const brands = await ec_brands.destroy({
                where: {
                    id
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Delete Brands',
                data: brands
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }   
    }
};