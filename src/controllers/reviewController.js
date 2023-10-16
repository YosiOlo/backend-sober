const {
    ec_reviews, 
    Sequelize, 
    ec_products, 
    ec_customer,
    ec_orders
} = require('../models');
const Op = Sequelize.Op;

module.exports = {
    async listReviews(req, res) {
        page = req.query.page || 1;
        limit = req.query.limit || 10;
        search = req.query.search || '';
        offset = (page - 1) * limit;
        try {
            const reviews = await ec_reviews.findAndCountAll({
                where: {
                    [Op.or]: [
                    {
                        comment: {
                            [Op.iLike]: `%${search}%`
                        },
                    }
                    ]
                },
                include: [
                    {
                        model: ec_products,
                        as: 'product',
                        attributes : ['id', 'name','images']
                    },
                    {
                        model: ec_customer,
                        as: 'customer',
                        attributes : ['id', 'name', 'email']
                    }
                ],
                limit: +limit,
                offset: +offset,
            });
            let arrays = [];
            reviews.rows.map((review) => {
                let images = []
                if (review.dataValues.product == null) {
                    arrays.push({review});
                    return;
                }
                const split = review.dataValues.product.images.split(',').map((image) => {
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                arrays.push({
                    ...review.dataValues,
                    product: {
                        ...review.product.dataValues,
                        images: images
                    }
                });
            });

            return res.status(200).json({
                status: 200,
                message: 'Success Get Reviews',
                data: {
                    count: reviews.count,
                    rows: arrays
                }
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async createReview(req, res) {
        try {
            const review = await ec_reviews.create({
                name: req.body.name,
                email: req.body.email,
                review: req.body.review,
                rating: req.body.rating,
                product_id: req.body.product_id,
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Create Review',
                data: review
            });
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async detailReview(req, res) {
        const {id} = req.params;
        try {
            const review = await ec_reviews.findOne({
                where: {
                    id: id
                }
            });
            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Not Found',
                    data: {}
                });
            } else {
                return res.status(200).json({
                    status: 200,
                    message: 'Success Get Review',
                    data: review
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async updateReview(req, res) {
        const {id} = req.params;
        try {
            const review = await ec_reviews.findOne({
                where: {
                    id: id
                }
            });
            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Not Found',
                    data: {}
                });
            } else {
                const review = await ec_reviews.update({
                    name: req.body.name,
                    email: req.body.email,
                    review: req.body.review,
                    rating: req.body.rating,
                    product_id: req.body.product_id,
                }, {
                    where: {
                        id: id
                    }
                });
                return res.status(200).json({
                    status: 200,
                    message: 'Success Update Review',
                    data: review
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async deleteReview(req, res) {
        const {id} = req.params;
        try {
            const review = await ec_reviews.findOne({
                where: {
                    id: id
                }
            });
            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Not Found',
                    data: {}
                });
            } else {
                const review = await ec_reviews.destroy({
                    where: {
                        id: id
                    }
                });
                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Review',
                    data: review
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }   
    },

    async vendorReview(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;

        try {
            const reviews = await ec_reviews.findAll({
                include: ['product', 'customer'],
                where: {
                    '$product.store_id$': storeId
                }
            });
            let arrays = [];
            reviews.map((review) => {
                let images = []
                if (review.dataValues.product == null) {
                    arrays.push({review});
                    return;
                }
                const split = review.dataValues.product.images.split(',').map((image) => {
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                arrays.push({
                    ...review.dataValues,
                    product: {
                        ...review.product.dataValues,
                        images: images
                    }
                });
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Reviews',
                data: arrays
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });
        }
    },
    
    async vendorReply(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {id} = req.params;
        const {reply, star} = req.body;

        try {
            const review = await ec_reviews.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: id
                        },
                        {
                            is_reply: true
                        }
                    ]
                }
            });
            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Not Found / Review Not Reply',
                    data: {}
                });
            } else {
                const reply = await ec_reviews.create({
                    parent_id: id,
                    comment: reply,
                    rating: star,
                    product_id: review.dataValues.product_id,
                    customer_id: review.dataValues.customer_id,
                    is_reply: false
                });

                try {
                    //update is_reply parent review to false
                    const update = await ec_reviews.update({
                        is_reply: false
                    }, {
                        where: {
                            id: id
                        }
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: 500,
                        message: 'Internal Server Error, Failed Update Parent Review',
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: 'Success Reply Review By Vendor',
                    data: review
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error, Failed Create Reply Review',
                data: error
            });
        }
    },

    async vendorDelete(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {id} = req.params;

        try {
            const review = await ec_reviews.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: id
                        },
                        {
                            "$product.store_id$": storeId
                        }
                    ]
                },
                include: ['product']
            });
            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Not Found / Review Not Match With Store',
                    data: {}
                });
            } else {
                const review = await ec_reviews.destroy({
                    where: {
                        id: id
                    }
                });
                return res.status(200).json({
                    status: 200,
                    message: 'Success Delete Review',
                    data: review
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error, Failed Delete Review',
                data: error
            });
        }
    },

    async vendorUpdate(req, res) {
        const storeId = req.user.dataValues.store.dataValues.id;
        const {id} = req.params;
        const {reply, star} = req.body;

        try {
            const review = await ec_reviews.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: id
                        },
                        {
                            "$product.store_id$": storeId
                        }
                    ]
                },
                include: ['product']
            });
            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Not Found / Review Not Match With Store',
                    data: {}
                });
            } else {
                const review = await ec_reviews.update({
                    comment: req.body.comment,
                    rating: req.body.rating,
                }, {
                    where: {
                        id: id
                    }
                });
                return res.status(200).json({
                    status: 200,
                    message: 'Success Update Review',
                    data: review
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error, Failed Update Review',
                data: error
            });
        }
    },

    async userList (req, res) {
        const userId = req.user.id;

        try {
            const reviews = await ec_reviews.findAll({
                where: {
                    customer_id: userId
                },
                include: [
                    {
                        model: ec_products,
                        as: 'product',
                        attributes : ['id', 'name','images']
                    },
                    {
                        model: ec_customer,
                        as: 'customer',
                        attributes : ['id', 'name', 'email']
                    }
                ],
            });
            let arrays = [];
            reviews.map((review) => {
                let images = []
                if (review.dataValues.product == null) {
                    arrays.push({review});
                    return;
                }
                const split = review.dataValues.product.images.split(',').map((image) => {
                    image = image.replace(/\\/g, "").replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "");
                    images.push(image);
                });
                arrays.push({
                    ...review.dataValues,
                    product: {
                        ...review.product.dataValues,
                        images: images
                    }
                });
            });
            return res.status(200).json({
                status: 200,
                message: 'Success Get Reviews',
                data: arrays
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
                data: error
            });   
        }
    },

    async userReview(req, res) {
        const userId = req.user.id;
        const orderId = req.params.orderId;
        const { star, comment } = req.body;
        const images = req.file? req.file.path : null;

        try {
            //check form
            if(!star || !comment) {
                return res.status(400).json({
                    status: 400,
                    message: 'Please Fill All Form',
                    data: {}
                });
            }
            //check transaction is complete
            const order = await ec_orders.findOne({
                where: {
                    id: orderId,
                    user_id: userId,
                    status: 'completed',
                    is_finished: true,
                },
                include : ['order_product']
            });

            if (!order) {
                return res.status(404).json({
                    status: 404,
                    message: 'Order Not Found / Order Not Complete Yet',
                    data: {}
                });
            } else {
                try {
                    if(images != null) {
                        const review = await ec_reviews.create({
                            comment: comment,
                            star: star,
                            product_id: order.order_product.product_id,
                            customer_id: userId,
                            is_reply: true,
                            images: images.replace('public/', '')
                        });
                    } else {
                        const review = await ec_reviews.create({
                            comment: comment,
                            star: star,
                            product_id: order.order_product.product_id,
                            customer_id: userId,
                            is_reply: true,
                        });
                    }
                } catch (error) {
                    return res.status(500).json({
                        status: 500,
                        message: 'Internal Server Error, Failed Insert Review',
                        data: error
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: 'Success Review Product',
                    data: review
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error, Failed Create Review',
                data: error
            });   
        }
    },

    async userUpdate(req, res) {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;
        const {
            star,
            comment
        } = req.body;

        const images = req.file? req.file.path : null;

        try {
            const review = await ec_reviews.findOne({
                where: {
                    id: reviewId,
                    customer_id: userId,
                    is_reply: 1
                }
            });

            //check already pass 7 days
            if(review.created_at < new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000))) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Cannot Update After 7 Days',
                    data: {}
                });
            }

            if (!review) {
                return res.status(404).json({
                    status: 404,
                    message: 'Review Not Found / Review Cannot Replied',
                    data: {}
                });
            } else {
                if(images != null) {
                    const review = await ec_reviews.update({
                        comment: comment,
                        star: star,
                        images: images.replace('public/', '')
                    }, {
                        where: {
                            id: reviewId
                        }
                    });
                } else {
                    const review = await ec_reviews.update({
                        comment: comment,
                        star: star,
                    }, {
                        where: {
                            id: reviewId
                        }
                    });
                }

                return res.status(200).json({
                    status: 200,
                    message: 'Success Update Review',
                    data: review
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: 'Internal Server Error, Failed Update Review',
                data: error
            });   
        }
    }
}