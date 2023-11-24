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
            console.log(e)
            return res.status(500).json({
                message: "Internal Error Server",
                status: 500
            });
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
            console.log(e)
            return res.status(500).json({
                message: "Error when get discount by id",
                status: 500
            });
        }
    },

    async vendorById(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {id} = req.params;
        try {
            const discount = await ec_discount.findOne({
                where: {
                    [Op.and]: [
                        {id: id},
                        {store_id: storeId}
                    ]
                }
            });
            if (discount === null) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } else {
                return res.status(200).json({message: 'Success get discount by id', status: 200 ,data: discount});
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: "Error when get discount by id",
                status: 500
            });
        }
    },

    async stillValid(req, res) {
        try {
            const discount = await ec_discount.findAll({
                where: {
                    [Op.and]: [
                        {start_date: {[Op.lte]: new Date()}},{
                            [Op.or]: [
                                {end_date: {[Op.gte]: new Date()}},
                                {end_date: null}
                            ]
                        }
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
            console.log(e)
            return res.status(500).json({
                message: "Error when get valid discount",
                status: 500
            });
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
            console.log(e)
            return res.status(500).json({
                message: "Error when delete discount",
                status: 500
            });
        }
    },

    async createDiscount(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;

        let {
            title, 
            code, 
            start_date, 
            end_date,
            quantity, 
            value,
            max_discount_amount,
            can_use_with_promotion,  
            product_quantity, 
            type_option, 
            target, 
        } = req.body;
        const never_expired = req.body.never_expired || false;

        //check field
        if (!title || !code || !value || !type_option || !start_date || !max_discount_amount ) {
            return res.status(400).json({message: 'Please fill all required field', status: 400});
        } else if (start_date > end_date) {
            return res.status(400).json({message: 'Start date must be less than end date', status: 400});
        } else if (type_option === 'percentage' && value > 100) {
            return res.status(400).json({message: 'Percentage value must be less than 100', status: 400});
        } else if (type_option === 'nominal' && value < 0) {
            return res.status(400).json({message: 'Nominal value must be greater than 0', status: 400});
        } else if (type_option === 'shipping' && value < 0) {
            return res.status(400).json({message: 'Shipping value must be greater than 0', status: 400});
        }

        //set default value
        if (quantity === '') {
            quantity = null;
        }
        if (never_expired) {
            end_date = null;
        }
        
        switch (type_option) {
            case 'percentage':
                type_option = 'percentage';
                break;
            case 'nominal':
                type_option = 'nominal';
                max_discount_amount = null;
                break;
            case 'shipping':
                type_option = 'shipping';
                break;
            default:
                type_option = 'percentage';
                break;
        }

        try {
            const data = {
                title, 
                code, 
                start_date, 
                end_date, 
                quantity, 
                value, 
                type: 'coupon', 
                can_use_with_promotion,  
                max_discount_amount,
                product_quantity, 
                type_option, 
                target, 
                store_id : storeId
            }
            const discount = await ec_discount.create(data);
            return res.status(201).json({message: 'Success', status: 201 ,data: discount});
        } catch (e) {
            if (e instanceof Sequelize.ValidationError) {
                return res.status(400).json({message: "code must unique", status: 400});
            } else {
                console.log(e)
                return res.status(500).json({
                    message: "Error when create discount",
                    status: 500
                });
            }
        }
    },

    async updateDiscount(req, res) {
        const {
            title, 
            code, 
            start_date, 
            end_date, 
            quantity, 
            value, 
            max_discount_amount,
        } = req.body;
        try {
            const discount = await ec_discount.findOne({
                where: {
                    id: req.params.id
                }
            
            });

            if (!discount) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } else {
                //check start date and end date
                if (start_date && end_date) {
                    if (start_date > end_date) {
                        return res.status(400).json({message: 'Start date must be less than end date', status: 400});
                    }
                    //check start date higher than today
                    const today = new Date();
                    if (start_date < today) {
                        return res.status(400).json({message: 'Start date must be higher than today', status: 400});
                    }
                }
                await discount.update({title, code, start_date, end_date, quantity, value, max_discount_amount});
                return res.status(200).json({message: 'Success update discount', status: 200 ,data: discount});
            }
        } catch (e) {
            if(e instanceof Sequelize.ValidationError) {
                return res.status(400).json({message: "code must unique", status: 400});
            } else {
                console.log(e)
                return res.status(500).json({message: "Error when update discount", status: 500});
            }
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
            console.log(e)
            return res.status(500).json({
                message: "Error when get vendor discount",
                status: 500
            });
        }
    },

    async checkDiscount(req, res) {
        const {code} = req.params;

        try {
            const discount = await ec_discount.findOne({
                where: {
                    code: code
                }
            });
            if (discount === null) {
                return res.status(404).json({message: 'Discount Not Found', status: 404});
            } if (discount.quantity === 0) {
                return res.status(400).json({message: 'Discount is out of stock', status: 400});
            } if (discount.start_date > new Date()) {
                return res.status(400).json({message: 'Discount is not started yet', status: 400});
            } if (discount.end_date < new Date()) {
                return res.status(400).json({message: 'Discount is expired', status: 400});
            } else {
                return res.status(200).json({message: 'Success', status: 200 ,data: discount});
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Error when check discount", status: 500});
        }
    }
};