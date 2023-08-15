const {ec_customer, Sequelize} = require('../models');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeMailer = require('nodemailer');

module.exports = {
    async forgotPassword(req, res) {
        const {email} = req.body;

        try {
            if (email === '') {
                return res.status(400).json({message: 'Please fill all field'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        const user = await ec_customer.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({message: 'Email not found'});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        const transporter = NodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Password',
            html: `<p>Click this link to reset your password <a href="${process.env.CLIENT_URL}/reset-password/${token}">Reset Password</a></p>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({message: err.message});
            } else {
                return res.status(200).json({message: 'Email sent'});
            }
        });
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

        const customers = await ec_customer.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
            },
            limit: parseInt(limit),
            offset: offset,
            include: ['customer_address', 'customer_paket', 'customer_recently_viewed_product']
        });

        return res.status(200).json(
            customers
        );
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
    }
}