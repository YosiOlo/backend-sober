const discountRoutes = require('express').Router();
const discountController = require('../controllers/discountController');

discountRoutes.get('/', discountController.index);
discountRoutes.get('/valid', discountController.stillValid);
discountRoutes.get('/:id', discountController.ById);

module.exports = discountRoutes;