const {contacts, contact_replies} = require('../models');

module.exports = {
    async listContacts(req, res) {
        try {
            const contact = await contacts.findAll({
                include: [
                    {
                        model: contact_replies,
                        as: 'replies'
                    }
                ],
                order: [
                    ['created_at', 'DESC']
                ]
            });
            res.status(200).send({
                status: 200,
                message: 'List of contacts',
                data: contact
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 500,
                message: 'Something went wrong'
            });
        }
    },

    async createContact(req, res) {
        const {name, email, phone, address, subject, content} = req.body;
        
        if (!name || !email || !phone || !address || !subject || !content) {
            return res.status(400).send({
                status: 400,
                message: 'All fields are required'
            });
        }
        try {
            const contact = await contacts.create({
                name,
                email,
                phone,
                address,
                subject,
                content,
            });
            res.status(201).send({
                status: 201,
                message: 'Contact has been created',
                data: contact
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 500,
                message: 'Something went wrong'
            });
        }
    },

    async deleteContact(req, res) {
        const {id} = req.params;
        try {
            //check replies
            const replies = await contact_replies.findAll({
                where: {
                    contact_id: id
                }
            });
            if (replies.length > 0) {
                return res.status(400).send({
                    status: 400,
                    message: 'Cannot delete contact with replies'
                });
            } else {
                await contacts.destroy({
                    where: {
                        id
                    }
                });
                res.status(200).send({
                    status: 200,
                    message: 'Contact has been deleted'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 500,
                message: 'Something went wrong'
            });
        }
    },

    async deleteReply(req, res) {
        const {id} = req.params;
        try {
            await contact_replies.destroy({
                where: {
                    id
                }
            });
            res.status(200).send({
                status: 200,
                message: 'Reply has been deleted'
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 500,
                message: 'Something went wrong'
            });
        }
    },

    async replyContact(req, res) {
        const {message} = req.body;
        const {id} = req.params;
        if (!message) {
            return res.status(400).send({
                status: 400,
                message: 'Message is required'
            });
        }
        try {
            //check already replied
            const replied = await contact_replies.findOne({
                where: {
                    contact_id: id
                }
            });
            if (replied) {
                return res.status(400).send({
                    status: 400,
                    message: 'Contact already replied'
                });
            } else {
                const reply = await contact_replies.create({
                    message,
                    contact_id: id
                });
                res.status(201).send({
                    status: 201,
                    message: 'Contact has been replied',
                    data: reply
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 500,
                message: 'Something went wrong'
            });
        }
    },

    async statusReadContact(req, res) {
        const {id} = req.params;
        try {
            await contacts.update({
                status: 'read'
            }, {
                where: {
                    id
                }
            });
            res.status(200).send({
                status: 200,
                message: 'Contact status has been updated'
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 500,
                message: 'Something went wrong'
            });
        }
    }
}