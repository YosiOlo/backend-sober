const {ec_customer, Sequelize} = require('../models');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeMailer = require('nodemailer');

module.exports = {
    async signup(req, res) {
        const {nama, email, password, repassword, referral, is_vendor} = req.body;

        try {
            if (nama === '' || email === '' || password === '' || repassword === '') {
                return res.status(400).json({message: 'Please fill all field'});
            }
            if (password !== repassword) {
                return res.status(400).json({message: 'Password not match'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        const user = await ec_customer.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            return res.status(400).json({message: 'Email already exist'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: '1d'});

            const newUser = await ec_customer.create({
                nama: nama,
                email: email,
                password: hashPassword,
                avatar: 'https://res.cloudinary.com/dkxt6mlnh/image/upload/v1682927959/drown/images-removebg-preview_nmbyo7.png',
                is_vendor: is_vendor,
                referral: referral,
                email_verify_token: token,
                created_at: new Date(),
                updated_at: new Date(),

            });

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
                subject: 'Verify Email',
                html: `<p>Click this link to verify your email <a href="${process.env.CLIENT_URL}/verify/${token}">Verify Email</a></p>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return res.status(500).json({message: err.message});
                } else {
                    return res.status(200).json({message: 'Email sent'});
                }
            });
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

    },

    async signin(req, res) {
        const {email, password, is_remember} = req.body;

        try {
            if (email === '' || password === '') {
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

        if (is_remember) {
            await ec_customer.update({
                remember_token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'})
            }, {
                where: {
                    id: user.id
                }
            });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
                return res.status(200).json({message: 'Login success', token: token});
            } else {
                return res.status(400).json({message: 'Password not match'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

    },

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
                pass: process.env.PASSWORD
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

    async resetPassword(req, res) {
        const {password, repassword} = req.body;
        const {token} = req.params;

        try {
            if (password === '' || repassword === '') {
                return res.status(400).json({message: 'Please fill all field'});
            }
            if (password !== repassword) {
                return res.status(400).json({message: 'Password not match'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        const user = await ec_customer.findOne({
            where: {
                id: jwt.verify(token, process.env.JWT_SECRET).id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        try {
            const hashPassword = await bcrypt.hash(password, 10);
            await ec_customer.update({password: hashPassword}, {
                where: {
                    id: user.id
                }
            });
            return res.status(200).json({message: 'Password updated'});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async verify(req, res) {
        const {token} = req.params;

        try {
            if (token === '' || token === undefined) {
                return res.status(400).json({message: 'Please fill all field'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        const user = await ec_customer.findOne({
            where: {
                id: jwt.verify(token, process.env.JWT_SECRET).id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        try {
            await ec_customer.update({is_verified: true}, {
                where: {
                    id: user.id
                }
            });
            return res.status(200).json({message: 'User verified'});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async checkToken (req, res) {
        const {token} = req.headers;

        try {
            if (token === '') {
                return res.status(400).json({message: 'Please fill all field'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        const user = await ec_customer.findOne({
            where: {
                id: jwt.verify(token, process.env.JWT_SECRET).id
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({
            email: user.email,
            message: 'Token valid',
            valid: decoded.exp > Date.now() / 1000,
            token: token
        });
    }
}