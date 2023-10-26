const jwt = require('jsonwebtoken');
const {ec_customer, roles, role_users, users, user_meta} = require('../models');

module.exports = {
    async verifyToken(req, res, next) {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({message: 'No token provided'});
        }

        try {
            token = token.replace('Bearer ', '');
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized, invalid token'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await ec_customer.findOne({
                where: {
                    id: decoded.id
                }
            });

            if (!user) {
                return res.status(401).json({message: 'Unauthorized, please register first'});
            }

            req.user = {user,...decoded};
            next();
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized'});
        }
    },

    async verifyVendor(req, res, next) {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({message: 'No token provided'});
        }

        try {
            token = token.replace('Bearer ', '');
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized, invalid token'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await ec_customer.findOne({
                where: {
                    id: decoded.id
                },
                include: ['store']
            });

            if (!user) {
                return res.status(401).json({message: 'Unauthorized, please register first'});
            }

            if (!user.is_vendor) {
                return res.status(401).json({message: 'Unauthorized, please register as vendor first'});
            }

            if (user.store == null) {
                return res.status(401).json({message: 'Unauthorized, please register your store first'});
            }
            req.user = user;
            next();
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized'});
        }
    },

    async verifyAdmin(req, res, next) {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({message: 'No token provided'});
        }

        try {
            token = token.replace('Bearer ', '');
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized, invalid token'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const admin = await users.findOne({
                where: {
                    email: decoded.email
                }
            });

            if (!admin) {
                return res.status(401).json({message: 'Unauthorized, user not admin'});
            }

            req.user = {admin};
            next();
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized'});
        }
    },
};