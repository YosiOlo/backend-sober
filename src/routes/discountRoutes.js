const discountRoutes = require('express').Router();
const discountController = require('../controllers/discountController');
const authMiddleware = require('../middlewares/authMiddleware');

discountRoutes.get('/', discountController.index);
discountRoutes.get('/valid', discountController.stillValid);
discountRoutes.get('/:id', discountController.ById);
discountRoutes.get('/check/:code', discountController.checkDiscount);

discountRoutes.get('/vendor/list', authMiddleware.verifyVendor, discountController.vendorDiscount);
discountRoutes.get('/vendor/list/:id', authMiddleware.verifyVendor, discountController.vendorById);
discountRoutes.post('/vendor/add', authMiddleware.verifyVendor, discountController.createDiscount);
discountRoutes.delete('/vendor/:id', authMiddleware.verifyVendor, discountController.deleteDiscount);
discountRoutes.put('/vendor/:id', authMiddleware.verifyVendor, discountController.updateDiscount);

module.exports = discountRoutes;