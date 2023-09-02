const {ec_customer, Sequelize, users} = require('../models');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeMailer = require('nodemailer');

module.exports = {
    async forgotPassword(req, res) {
        const {password, repassword, oldpassword} = req.body;
        const {id} = req.user;

        try {
            if (password !== repassword) {
                return res.status(400).json({message: 'Password not match'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        const user = await ec_customer.findOne({
            where: {
                id: id
            }
        });

        const compare = await bcrypt.compare(oldpassword, user.password);

        if (!compare) {
            return res.status(400).json({message: 'Old password not match'});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await ec_customer.update({
            password: hash
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({message: 'Password updated'});
    },

    async updateProfile(req, res) {
        const {id} = req.params;
        const {name, phone, address} = req.body;

        if (id === '' || id === undefined) {
            return res.status(400).json({message: 'Please fill id field'});
        }

        const user = await ec_customer.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        await ec_customer.update({
            name: name,
            phone: phone,
            address: address
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({message: 'Profile updated'});
    },

    async listCustomer(req, res) {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const search = req.query.search ? req.query.search: '';

        const offset = page * limit - limit;

        try {
            const customers = await ec_customer.findAndCountAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            email: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            phone: {
                                [Op.iLike]: `%${search}%`
                            }
                        }
                    ]
                },
                limit: parseInt(limit),
                offset: offset,
                include: ['customer_address', 'customer_paket', 'customer_recently_viewed_product', 'store', 'customer_review', 'customer_tier']
            });
    
            return res.status(200).json(
                customers
            );
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async currentUser(req, res) {
        const {id} = req.user;

        const user = await ec_customer.findOne({
            where: {
                id: id
            },
            include: ['customer_address', 'customer_paket', 'customer_recently_viewed_product']
        });

        return res.status(200).json(user);
    },

    //admin
    async addAdmin(req, res) {
        const {first_name, last_name, username, email, password, repassword} = req.body;

        if (password !== repassword) {
            return res.status(400).json({message: 'Password not match'});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await users.create({
            username: username,
            email: email,
            password: hash,
            super_user: 1,
            manage_supers: 1
        });

        return res.status(200).json({message: 'Admin created'});
    },

    async updateProfileAdmin(req, res) {
        const {id} = req.user;
        const {first_name, last_name, username, email} = req.body;

        if (id === '' || id === undefined) {
            return res.status(400).json({message: 'Please fill id field'});
        }

        const user = await users.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        await users.update({
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({message: 'Profile updated'});
    },

    async updateCustomerProfile(req, res) {
        const {id} = req.user;
        const {fullname, dateofbirth, phone} = req.body;
        
        //image upload path
        const image_link = req.files['image_link'];

        if (id === '' || id === undefined) {
            return res.status(400).json({message: 'Please fill id field'});
        }

        const user = await ec_customer.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        await ec_customer.update({
            fullname: fullname,
            dateofbirth: dateofbirth,
            phone: phone,
            avatar: image_link[0].path
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({message: 'Profile updated'});
    },

}