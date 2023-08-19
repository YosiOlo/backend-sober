const jwt = require('jsonwebtoken');
const {ec_customer, roles, role_users, users, user_meta} = require('../models');

module.exports = {
    async verifyToken(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({message: 'No token provided'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await ec_customer.findOne({
                where: {
                    id: decoded.id
                }
            });

            if (!user) {
                return res.status(401).json({message: 'Unauthorized'});
            }

            req.user = user;
            next();
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized'});
        }
    },

    async verifyVendor(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({message: 'No token provided'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await ec_customer.findOne({
                where: {
                    id: decoded.id
                }
            });

            if (!user) {
                return res.status(401).json({message: 'Unauthorized'});
            }

            if (!user.is_vendor) {
                return res.status(401).json({message: 'Unauthorized'});
            }

            req.user = user;
            next();
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized'});
        }
    },

    async verifyAdmin(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({message: 'No token provided'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await ec_customer.findOne({
                where: {
                    id: decoded.id
                }
            });

            if (!user) {
                return res.status(401).json({message: 'Unauthorized'});
            }

            const role = await roles.findOne({
                where: {
                    name: 'admin'
                }
            });

            const roleUser = await role_users.findOne({
                where: {
                    role_id: role.id,
                    user_id: user.id
                }
            });

            if (!roleUser) {
                return res.status(401).json({message: 'Unauthorized'});
            }

            req.user = user;
            next();
        } catch (e) {
            return res.status(401).json({message: 'Unauthorized'});
        }
    },
};