const {
    ec_customer, 
    users, 
    ec_paket_master,
    Sequelize
} = require('../models');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeMailer = require('nodemailer');
const { reset } = require('nodemon');

module.exports = {
    async signup(req, res) {
        const {nama, email, password, repassword, referral, is_vendor, tier} = req.body;

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

        const membershiptier = await ec_paket_master.findOne({
            where: {
                id: tier
            }
        });

        if (!membershiptier) {
            return res.status(400).json({message: 'Membership tier not found'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '2h'}, { algorithm: 'RS256' });

            const newUser = await ec_customer.create({
                name: nama,
                email: email,
                password: hashPassword,
                status: "disabled",
                avatar: 'https://res.cloudinary.com/dkxt6mlnh/image/upload/v1682927959/drown/images-removebg-preview_nmbyo7.png',
                is_vendor: is_vendor,
                commissions_referral: referral,
                email_verify_token: token,
                level: tier ? tier : null
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
                subject: 'Verify Email Sobermart',
                html: `<!DOCTYPE html>
<html>
    <center> 
        <h1>Email Verification For ${nama}</h1>
        <p>Click this link to verify your email, valid for 2 hours</p>
        <div>
            <img src="https://res.cloudinary.com/dkxt6mlnh/image/upload/v1691564307/sobermart/sob-logos-1_bnnccj.png" alt="Drown Logo" width="310" height="85">
        </div>
        <button 
            style=
            "
            border: none;
            transition-duration: 0.4s;
            cursor: pointer;
            background-color: #76b5c3;
            margin-top: 20px;
            border-radius: 12px;
            "
            type="button"
        > 
            <a 
            style=
            "
            text-decoration: none;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;color: white;
            padding: 10px 32px;
            transition-duration: 0.4s;" 
            href='http://localhost:3000/api/auth/verify/${token}'>Verify Email</a>
        </button>
        <center>
</html>`
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
        const token_remember = req.cookies ? req.cookies.token_remember : null;

        //check cookies token
        if (token_remember) {
            try {
                const decoded = jwt.verify(token_remember, process.env.JWT_SECRET);
                const user = await ec_customer.findOne({
                    where: {
                        id: decoded.id
                    }
                });

                const admin = await users.findOne({
                    where: {
                        id: decoded.id
                    }
                });

                if (user) {
                    const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1d'}, { algorithm: 'RS256' });
                    //set is active
                    await ec_customer.update({
                        is_active: 1,
                        last_active: new Date()
                    }, {
                        where: {
                            id: user.id
                        }
                    });
                    return res.status(200).json({message: 'Login success using cookies', token: token});
                } else if (admin) {
                    const token = jwt.sign({id: admin.id, email: admin.email}, process.env.JWT_SECRET, {expiresIn: '1d'}, { algorithm: 'RS256' });
                    return res.status(200).json({message: 'Admin Login success using cookies', token: token});
                }
                
                if (!user || !admin) {
                    return res.status(401).json({message: 'Unauthorized, user not found'});
                }
            } catch(e) {
                if (e instanceof jwt.JsonWebTokenError) {
                    return res.status(401).json({message: 'Unauthorized, token invalid'});
                } else if (e instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({message: 'Unauthorized, token expired'});
                } else {
                    return res.status(401).json({message: 'Unauthorized, internal error'});
                }
            }
        }

        //check field
        try {
            if (email === '' || password === '') {
                return res.status(400).json({message: 'Please fill all field'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

        //check superadmin
        try {
            const admins = await users.findOne({
                where: {
                    [Op.or]: [
                        {email: email},
                        {username: email}
                    ]
                }
            });
            if (admins) {
                if (await bcrypt.compare(password, admins.password)) {
                    const token = jwt.sign({id: admins.id, email: admins.email}, process.env.JWT_SECRET, {expiresIn: '1d'});
                    return res.status(200).json({message: 'Admin Login success', token: token});
                } else {
                    return res.status(400).json({message: 'Password not match', status: 400});
                }
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
            const tokens = jwt.sign({id: user.id, email: email}, process.env.JWT_SECRET, {expiresIn: '7d'});
            await ec_customer.update({
                remember_token: tokens
            }, {
                where: {
                    id: user.id
                }
            });
            try {
                if (await bcrypt.compare(password, user.password)) {
                    //set is active
                    await ec_customer.update({
                        is_active: 1,
                        last_active: new Date()
                    }, {
                        where: {
                            id: user.id
                        }
                    });
                    const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1d'});
                    res.cookie('token_remember', tokens, {maxAge: 604800000, httpOnly: true, path: '/sober/api/auth/signin'});
                    return res.status(200).json({message: 'Login success and send cookies', status: 200,email: user.email, token: token});
                } else {
                    return res.status(400).json({message: 'Password not match', status: 400});
                }
            } catch (e) {
                return res.status(500).json({message: e.message});
            }
        } else {
            try {
                if (await bcrypt.compare(password, user.password)) {
                    //set is active
                    await ec_customer.update({
                        is_active: 1,
                        last_active: new Date()
                    }, {
                        where: {
                            id: user.id
                        }
                    });
                    const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1d'});
                    return res.status(200).json({message: 'Login success', status: 200,email: user.email, token: token});
                } else {
                    return res.status(400).json({message: 'Password not match', status: 400});
                }
            } catch (e) {
                return res.status(500).json({message: e.message});
            }
        }
        

    },

    async resetPassword(req, res) {
        const {password, repassword, token} = req.body;

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
            return res.render("resetSuccess.ejs")
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
            return res.status(500).json({message: "Internal Error", e});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.exp < Date.now() / 1000) {
            return res.status(400).json({message: 'Token expired'});
        }

        const user = await ec_customer.findOne({
            where: {
                email: decoded.email
            }
        });

        if (!user) {
            return res.status(400).json({message: 'User not found'});
        }
        if (user.status == "activated") {
            return res.render("alreadyVerified.ejs")
        }
        
        let update = {
            email_verify_token: null,
            status: "activated",
            confirmed_at: new Date(),
        }
        try {
            await ec_customer.update(update, {
                where: {
                    id: user.id
                }
            });
            return res.render("emailVerified.ejs")
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async checkToken (req, res) {
        const data = req.user;

        return res.status(200).json({
            email: data.email,
            message: 'Token valid',
            is_valid: data.exp > Date.now() / 1000,
            is_vendor: data.user.dataValues.is_vendor,
            datas: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.avatar,
                status: data.user.status,
                is_vendor: data.user.is_vendor,
                phone : data.user.phone,
                is_active: data.user.is_active,
                last_active: data.user.last_active,
            }
        });
    },

    async sendEmailResetPassword(req, res) {
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
            return res.status(400).json({message: 'User not found'});
        }

        try {
            const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '2h'}, { algorithm: 'RS256' });

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
                subject: 'Reset Password Sobermart',
                html: `<!DOCTYPE html>
                <html>
                    <center> 
                        <h1>Reset Verification For ${user.name}</h1>
                        <p>Click this link to reset your account password, valid for 2 hours</p>
                        <div>
                            <img src="https://res.cloudinary.com/dkxt6mlnh/image/upload/v1691564307/sobermart/sob-logos-1_bnnccj.png" alt="Drown Logo" width="310" height="85">
                        </div>
                        <button 
                            style=
                            "
                            border: none;
                            transition-duration: 0.4s;
                            cursor: pointer;
                            background-color: #76b5c3;
                            margin-top: 20px;
                            border-radius: 12px;
                            "
                            type="button"
                        > 
                            <a 
                            style=
                            "
                            text-decoration: none;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;color: white;
                            padding: 10px 32px;
                            transition-duration: 0.4s;" 
                            href='http://localhost:3000/api/auth/resetpage/${token}'>Reset Password</a>
                        </button>
                        <center>
                </html>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return res.status(500).json({message: err.message});
                }
                return res.status(200).json({message: 'Reset Password email sent', status: 200});
            });
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    },

    async resetPage(req, res) {
        const {token} = req.params;

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
        if (decoded.exp < Date.now() / 1000) {
            return res.status(400).json({message: 'Token expired'});
        }

        return res.render("resetPassword.ejs", {token: token});
    },

    async logout(req, res) {
        const data = req.user;

        try {
            if (data.user.dataValues.remember_token !== null) {
                await ec_customer.update({
                    remember_token: null,
                    is_active: false,
                    last_active: new Date()
                }, {
                    where: {
                        id: data.user.id
                    }
                });
            } else {
                await ec_customer.update({
                    is_active: false,
                    last_active: new Date()
                }, {
                    where: {
                        id: data.user.id
                    }
                });
            }
    
            return res.status(200).json({message: 'Logout success'});
        } catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

}