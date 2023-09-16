const reviewRoutes = require('express').Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

reviewRoutes.get('/admin', authMiddleware.verifyAdmin,reviewController.listReviews);
reviewRoutes.get('/admin/:id', authMiddleware.verifyAdmin,reviewController.detailReview);
reviewRoutes.post('/admin', authMiddleware.verifyToken, reviewController.createReview);
reviewRoutes.delete('/admin/:id', authMiddleware.verifyAdmin, reviewController.deleteReview);
reviewRoutes.put('/admin/:id', authMiddleware.verifyToken, reviewController.updateReview);

reviewRoutes.get('/vendor/list', authMiddleware.verifyVendor, reviewController.vendorReview);
reviewRoutes.post('/vendor/reply/:id', authMiddleware.verifyVendor, reviewController.vendorReply);

reviewRoutes.get('/list', authMiddleware.verifyToken, reviewController.userList);
reviewRoutes.post('/:orderId', authMiddleware.verifyToken, uploadMiddleware.reviewUpload, reviewController.userReview);
reviewRoutes.put('/:reviewId', authMiddleware.verifyToken, uploadMiddleware.reviewUpload, reviewController.userUpdate);

module.exports = reviewRoutes;