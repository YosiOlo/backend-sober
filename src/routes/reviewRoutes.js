const reviewRoutes = require('express').Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

reviewRoutes.get('/', reviewController.listReviews);
reviewRoutes.get('/:id', reviewController.detailReview);
reviewRoutes.post('/', reviewController.createReview);
reviewRoutes.delete('/:id', reviewController.deleteReview);
reviewRoutes.put('/:id', reviewController.updateReview);

module.exports = reviewRoutes;