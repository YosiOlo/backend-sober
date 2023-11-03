const {
    Sequelize,
    ec_orders,
    ec_order_addresses,
    ec_order_histories,
    ec_order_product,
    ec_order_referrals,
    midtrans,
    ec_products,
} = require('../models')
const { Op } = Sequelize.Op
const midtransClient = require('midtrans-client')
const { v4: uuidv4 } = require('uuid')

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_TOKEN,
    clientKey: process.env.MIDTRANS_CLIENT_TOKEN
})

module.exports = {
    async createOrder (req, res) {
        try {
            const { 
                nama,
                email,
                phone,
                provinsi,
                kota,
                alamat,
                kodepos,
                shipping,
                coupon_code,
                total_price,
            } = req.body

            const productId = req.params.id
            const userId = req.user.id

            const product = await ec_products.findOne({
                where: {
                    id: productId
                }
            })
            if (!product) {
                return res.status(404).send({
                    message: 'Product not found'
                })
            }

            const order = await ec_orders.create({
                user_id: userId,

            })
            res.status(201).send({
                message: 'Order Created',
                order
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error when create order',
                error
            })
        }
    },

    async payment(req, res) {
        try {
            const { 
                payment_type,
                order_id, 
                product_id, 
                quantity, 
                total_price, 
                status 
            } = req.body

            let enabled_payments = []
            const user = req.user
            // const order = await ec_orders.create({
            //     order_id,
            //     product_id,
            //     user_id,
            //     quantity,
            //     total_price,
            //     status
            // })

            switch (payment_type) {
                case 'bca_va':
                    enabled_payments = ['bca_va']
                    break
                case 'bni_va':
                    enabled_payments = ['bni_va']
                    break
                case 'bri_va':
                    enabled_payments = ['bri_va']
                    break
                case 'echannel':
                    enabled_payments = ['echannel']
                    break
                case 'gopay':
                    enabled_payments = ['gopay']
                    break
                case 'indomaret':
                    enabled_payments = ['indomaret']
                    break
                case 'permata_va':
                    enabled_payments = ['permata_va']
                    break
                case 'shopeepay':
                    enabled_payments = ['shopeepay']
                    break
                case 'alfamart':
                    enabled_payments = ['alfamart']
                    break
                default:
                    enabled_payments = ['bca_va', 'bni_va', 'bri_va', 'echannel', 'gopay', 'indomaret', 'permata_va', 'shopeepay', 'alfamart']
                    break
            }

            const parameter = {
                transaction_details: {
                    order_id: order_id,
                    gross_amount: total_price,
                    description: 'Pembayaran Order'
                },
                customer_details: {
                    first_name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                enabled_payments: enabled_payments,
            }
            const transaction = await snap.createTransaction(parameter)
            res.status(201).send({
                message: 'Order Payment Created',
                token: transaction.token,
                redirect_url: transaction.redirect_url,
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error when create order',
                error
            })
        }
    },
}