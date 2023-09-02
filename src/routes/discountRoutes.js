const discountRoutes = require('express').Router();
const discountController = require('../controllers/discountController');
const authMiddleware = require('../middlewares/authMiddleware');

discountRoutes.get('/', discountController.index);
discountRoutes.get('/valid', discountController.stillValid);
discountRoutes.get('/:id', discountController.ById);

discountRoutes.post('/', authMiddleware.verifyVendor, discountController.createDiscount);
discountRoutes.delete('/:id', authMiddleware.verifyVendor, discountController.deleteDiscount);
discountRoutes.put('/:id', authMiddleware.verifyVendor, discountController.updateDiscount);

module.exports = discountRoutes;