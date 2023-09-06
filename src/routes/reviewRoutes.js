const reviewRoutes = require('express').Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

reviewRoutes.get('/', reviewController.listReviews);
reviewRoutes.get('/:id', reviewController.detailReview);
reviewRoutes.post('/', authMiddleware.verifyToken, reviewController.createReview);
reviewRoutes.delete('/:id', authMiddleware.verifyAdmin, reviewController.deleteReview);
reviewRoutes.put('/:id', authMiddleware.verifyToken, reviewController.updateReview);

reviewRoutes.get('/vendor/list', authMiddleware.verifyVendor, reviewController.vendorReview);

module.exports = reviewRoutes;