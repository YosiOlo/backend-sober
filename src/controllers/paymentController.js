const {
    Sequelize,
    ec_orders,
    ec_order_addresses,
    ec_order_histories,
    ec_order_product,
    ec_order_referrals,
    midtrans,
    payments,
    ec_products,
    ec_discount,
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
                coupon_code,
                shipping_service,
                quantity,
            } = req.body
            let { sub_total, total_price, ship_amount } = req.body

            //check field
            if (!nama || !email || !phone || !provinsi || !kota || !alamat || !kodepos || !total_price || !ship_amount || !sub_total || !shipping_service || !quantity) {
                return res.status(400).send({
                    message: 'Please fill all field'
                })
            }

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

            //check coupon
            if (coupon_code && coupon_code !== '') {
                const coupon = await ec_discount.findOne({
                    where: {
                        code: coupon_code
                    }
                })
                if (!coupon) {
                    return res.status(404).send({
                        message: 'Coupon not found'
                    })
                } else {
                    if(coupon.type_option === 'percentage') {
                        sub_total = parseInt(sub_total) - (parseInt(sub_total) * coupon.value / 100)
                        total_price = sub_total + parseInt(ship_amount)
                    } else if(coupon.type_option === 'shipping') {
                        ship_amount = parseInt(ship_amount) - coupon.value
                        total_price = parseInt(sub_total) + ship_amount
                    } else if(coupon.type_option === 'nominal') {
                        total_price = parseInt(total_price) - coupon.value
                    } else {
                        return res.status(400).send({
                            message: 'Coupon not valid'
                        })
                    }
                }    
            }

            try {
                const insertOrder = await ec_orders.create({
                    user_id: userId,
                    coupon_code,
                    amount: total_price,
                    status: 'pending',
                    is_finished: false,
                    is_confirmed: false,
                    coupon_code,
                    store_id: product.store_id,
                    shipping_method: "JNE",
                    shipping_amount: ship_amount,
                    sub_total,
                    shipping_service,
                })
                await ec_order_product.create({
                    order_id: insertOrder.id,
                    product_id: productId,
                    qty: quantity,
                    price: product.price,
                    tax_amount: 0,
                    product_name: product.name,
                    product_image: product.image,
                    weight: product.weight,
                    product_type: product.type,
                })
                await ec_order_addresses.create({
                    order_id: insertOrder.id,
                    name: nama,
                    email,
                    phone,
                    state: provinsi,
                    city: kota,
                    address: alamat,
                    zip_code: kodepos,
                    country: 'Indonesia',
                })
                await ec_order_histories.create({
                    order_id: insertOrder.id,
                    action: 'create_order',
                    description: `Order ${insertOrder.code} has been created`,
                })
                
                await insertOrder.update({
                    code: `SB${parseInt(insertOrder.id) + 10000000}`,
                }, {
                    where: {
                        id: insertOrder.id
                    }
                })
                res.status(201).send({
                    message: 'Order has been created',
                    data: insertOrder
                })
            } catch (error) {
                console.log(error)
                res.status(500).send({
                    message: 'Error when insert data',
                    status: 'error'
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error when create order',
                status: 'error'
            })
        }
    },

    async payment(req, res) {
        try {
            const { 
                payment_type,
                order_id
            } = req.body

            let enabled_payments = []
            let bank = []
            const user = req.user

            //check order
            const order = await ec_orders.findOne({
                where: {
                    id: order_id
                }
            })
            if (!order) {
                return res.status(404).send({
                    message: 'Order not found'
                })
            }

            switch (payment_type) {
                case 'bca_va':
                    enabled_payments = ['bca_va']
                    bank = ['bank_transfer', 'bca']
                    break
                case 'bni_va':
                    enabled_payments = ['bni_va']
                    bank = ['bank_transfer', 'bni']
                    break
                case 'bri_va':
                    enabled_payments = ['bri_va']
                    bank = ['bank_transfer', 'bri']
                    break
                case 'echannel':
                    enabled_payments = ['echannel']
                    bank = ['bank_transfer', 'mandiri']
                    break
                case 'gopay':
                    enabled_payments = ['gopay']
                    bank = ['e-wallet', 'gopay']
                    break
                case 'indomaret':
                    enabled_payments = ['indomaret']
                    bank = ['cstore', 'indomaret']
                    break
                case 'permata_va':
                    enabled_payments = ['permata_va']
                    bank = ['bank_transfer', 'permata']
                    break
                case 'shopeepay':
                    enabled_payments = ['shopeepay']
                    bank = ['e-wallet', 'shopeepay']
                    break
                case 'alfamart':
                    enabled_payments = ['alfamart']
                    bank = ['cstore', 'alfamart']
                    break
                default:
                    enabled_payments = ['bca_va', 'bni_va', 'bri_va', 'echannel', 'gopay', 'indomaret', 'permata_va', 'shopeepay', 'alfamart']
                    bank = ['default', 'default']
                    break
            }

            const parameter = {
                transaction_details: {
                    order_id: order.code,
                    gross_amount: order.amount,
                    description: 'Pembayaran Order'
                },
                customer_details: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                },
                enabled_payments: enabled_payments,
                page_expiry: {
                    duration: 6,
                    unit: 'hours'
                }
            }
            const transaction = await snap.createTransaction(parameter)

            //insert payment
            const insertPay = await payments.create({
                order_id,
                customer_id: user.id,
                payment_type: 'confirm',
                payment_channel: bank[0],
                transaction_id: transaction.transaction_id,
                charge_id: transaction.token,
                status: 'pending',
                currency: 'IDR',
                amount: order.amount,
                user_id: 0,
                description: 'Pembayaran Order',
                bank: bank[1],
                link_payment: transaction.redirect_url,
                expiry_time: new Date(Date.now() + 6 * 60 * 60 * 1000)
            })

            //update order
            await ec_orders.update({
                payment_id: insertPay.id,
            }, {
                where: {
                    id: order_id
                }
            })

            res.status(201).send({
                message: 'Order Payment Created',
                expiry: "transaction will be expired in 6 hours",
                order_code: order.code,
                token: transaction.token,
                redirect_url: transaction.redirect_url,
            })

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error when create order',
            })
        }
    },

    async paymentReturnData(req, res) {
        try {
            const returnObject = req.body

            //check order
            const order = await ec_orders.findOne({
                where: {
                    code: returnObject.order_id
                }
            })
            if (!order) {
                return res.status(404).send({
                    message: 'invalid order'
                })
            } else {
                if (returnObject.transaction_status === 'settlement') {
                    await payments.update({
                        status: 'completed',
                        completed_at: new Date(),
                        transaction_time: returnObject.transaction_time,
                    }, {
                        where: {
                            id: order.payment_id
                        }
                    })

                    await ec_order_histories.create({
                        user_id: order.user_id,
                        action: 'confirm_payment',
                        description: `Payment for order ${order.code} has been completed amount ${order.amount}`,
                        order_id: order.id,
                    })

                } else if (returnObject.transaction_status === 'pending') {
                    await payments.update({
                        status: 'pending payment',
                    }, {
                        where: {
                            id: order.payment_id
                        }
                    })
                }
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error when get order payment data',
            })
        }
    },

    async paymentByid(req, res) {
        try {
            const orderId = req.params.id
            const userId = req.user.id

            //check payment
            const payment = await payments.findOne({
                where: {
                    order_id: orderId,
                    customer_id: userId
                }
            })
            if (!payment) {
                return res.status(404).send({
                    message: 'Payment not found'
                })
            }

            res.status(200).send({
                message: 'Url Payment data',
                data: {
                    token: payment.charge_id,
                    redirect_url: payment.link_payment,
                }
            })

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Error when get order payment data',
            })
        }
    }
    
}