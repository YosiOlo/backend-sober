const { ec_discount, Sequelize} = require('../models');
const { ById } = require('./currencyController');
const Op = Sequelize.Op;


module.exports = {
    async index(req, res) {
        try {
            const discount = await ec_discount.findAll({
                order: [
                    ['created_at', 'DESC']
                ]
            });
            if (discount.length < 1) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } else {
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async ById(req, res) {
        try {
            const discount = await ec_discount.findByPk(req.params.id);
            if (discount === null) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } else {
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async stillValid(req, res) {
        try {
            const discount = await ec_discount.findAll({
                where: {
                    [Op.and]: [
                        {start_date: {[Op.lte]: new Date()}},
                        {end_date: {[Op.gte]: new Date()}},
                        {quantity: {[Op.gt]: 0}}
                    ]
                },
                order: [
                    ['created_at', 'DESC']
                ]
            });
            if (discount.length < 1) {
                return res.status(404).json({message: 'No Valid Discount Found', status: 404});
            } else {
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async deleteDiscount(req, res) {
        try {
            const discount = await ec_discount.findByPk(req.params.id);
            if (discount === null) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } else {
                await discount.destroy();
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async createDiscount(req, res) {
        const {title, code, start_date, end_date, quantity, value, type, can_use_with_promotion, discount_on, product_quantity, type_option, target, min_order_price, store_id} = req.body;
        try {
            const discount = await ec_discount.create({title, code, start_date, end_date, quantity, value, type, can_use_with_promotion, discount_on, product_quantity, type_option, target, min_order_price, store_id});
            return res.status(201).json({message: 'Success', status: 201 ,data: discount});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async updateDiscount(req, res) {
        const {title, code, start_date, end_date, quantity, value, type, can_use_with_promotion, discount_on, product_quantity, type_option, target, min_order_price, store_id} = req.body;
        try {
            const discount = await ec_discount.findByPk(req.params.id);
            if (discount === null) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } else {
                await discount.update({title, code, start_date, end_date, quantity, value, type, can_use_with_promotion, discount_on, product_quantity, type_option, target, min_order_price, store_id});
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async vendorDiscount(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        console.log(storeId);

        try {
            const discount = await ec_discount.findAll({
                where: {store_id: storeId},
                order: [
                    ['created_at', 'DESC']
                ]
            });
            if (discount.length < 1) {
                return res.status(404).json({message: 'Vendor, Discount Not Found', status: 404});
            } else {
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

};