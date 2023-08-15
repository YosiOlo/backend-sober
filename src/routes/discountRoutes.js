const discountRoutes = require('express').Router();
const discountController = require('../controllers/discountController');

discountRoutes.get('/', discountController.index);
discountRoutes.get('/:id', discountController.ById);
discountRoutes.get('/still-valid', discountController.stillValid);

module.exports = discountRoutes;