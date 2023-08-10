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
            const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '2h'}, { algorithm: 'RS256' });

            const newUser = await ec_customer.create({
                name: nama,
                email: email,
                password: hashPassword,
                status: "disabled",
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
        // const {token_remember} = req.cookies;

        // if (token_remember !== undefined) {
        //     try {
        //         const decoded = jwt.verify(token_remember, process.env.JWT_SECRET);
        //         const user = await ec_customer.findOne({
        //             where: {
        //                 id: decoded.id
        //             }
        //         });

        //         if (user) {
        //             const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'}, { algorithm: 'RS256' });
        //             return res.status(200).json({message: 'Login success', token: token});
        //         }
        //     } catch(e) {
        //         return res.status(500).json({message: e.message});
        //     }
        // }

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
                return res.status(200).json({message: 'Login success', status: 200, token: token});
            } else {
                return res.status(400).json({message: 'Password not match'});
            }
        } catch (e) {
            return res.status(500).json({message: e.message});
        }

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