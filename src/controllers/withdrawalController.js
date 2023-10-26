const {
    Sequelize,
    member_withdrawal,
    mp_vendor_info,
    mp_customer_revenues,
    ec_customer
} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async getAll(req, res) {
        try {
            const withdrawal = await member_withdrawal.findAll({
                order: [
                    ['id', 'DESC']
                ]
            });
            res.status(200).json({
                status: true,
                message: 'Success',
                data: withdrawal
            });
        } catch (error) {
            res.status(400).json({
                status: false,
                message: error.message
            });
        }
    },

    async getAllByCustomerId(req, res) {
        const {customerId} = req.params

        try {
            const withdrawal = await member_withdrawal.findAll({
                where: {
                    [Op.or]: [
                        {customer_id: customerId},
                    ]
                },
                order: [
                    ['id', 'DESC']
                ]
            });
            if(withdrawal.length > 0) {
                res.status(200).json({
                    status: 200,
                    message: 'Success Get Withdrawal',
                    data: withdrawal
                });
            }
            else {
                res.status(404).json({
                    status: 404,
                    message: 'Withdrawal Not Found',
                    data: []
                });
            }
        } catch (error) {
            res.status(400).json({
                status: false,
                message: error.message
            });
        }
    },

    async acceptWidhrawal(req, res) {
        const {withdrawalId} = req.params

        try {
            const withdrawal = await member_withdrawal.findByPk(withdrawalId);
            if (withdrawal === null) {
                return res.status(404).json({message: 'Withdrawal Not Found', status: 404});
            } else {
                await member_withdrawal.update({
                    status: 'accepted'
                }, {
                    where: {
                        id: withdrawalId
                    }
                });

                await mp_vendor_info.update({
                    balance: Sequelize.literal(`balance - ${withdrawal.amount}`)
                }, {
                    where: {
                        customer_id: withdrawal.customer_id
                    }
                });

                return res.status(200).json({message: 'Success Accept Withdrawal', status: 200});
            }
        } catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    },

    async declineWithdrawal(req, res) {
        const {withdrawalId} = req.params

        try {
            const withdrawal = await member_withdrawal.findByPk(withdrawalId);
            if (withdrawal === null) {
                return res.status(404).json({message: 'Withdrawal Not Found', status: 404});
            } else {
                await member_withdrawal.update({
                    status: 'declined'
                }, {
                    where: {
                        id: withdrawalId
                    }
                });

                return res.status(200).json({message: 'Success Decline Withdrawal', status: 200});
            }
        } catch (e) {
            return res.status(500).json({status: 500, message: e.message});
        }
    }
}