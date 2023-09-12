const transactionRoutes =  require("express").Router();
const transactionController = require("../controllers/transactionController");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

//admin
transactionRoutes.get('/admin', authMiddleware.verifyAdmin, transactionController.getAll);
transactionRoutes.get('/admin/:id', authMiddleware.verifyAdmin,transactionController.index);
transactionRoutes.delete('/admin', authMiddleware.verifyAdmin,transactionController.destroy)

//user
transactionRoutes.get('/user', authMiddleware.verifyToken, transactionController.getUser);
transactionRoutes.post('/user', authMiddleware.verifyToken);
transactionRoutes.get('/cart', authMiddleware.verifyToken, cartController.cartUser);
transactionRoutes.post('/cart/:id', authMiddleware.verifyToken, cartController.addCart);
transactionRoutes.delete('/cart/:id', authMiddleware.verifyToken, cartController.deleteCart);
transactionRoutes.put('/cart/:id', authMiddleware.verifyToken, cartController.updateCart);

//vendor
transactionRoutes.get('/vendor', authMiddleware.verifyVendor, transactionController.getVendor);
transactionRoutes.get('/vendor/returns', authMiddleware.verifyVendor, transactionController.orderReturn);
transactionRoutes.get('/vendor/revenue', authMiddleware.verifyVendor, transactionController.vendorRevenue);
transactionRoutes.get('/vendor/withdrawal', authMiddleware.verifyVendor, transactionController.vendorWithdrawal);
transactionRoutes.post('/vendor/withdrawal', authMiddleware.verifyVendor, transactionController.vendorAddWithdrawal)
transactionRoutes.delete('/vendor/:transId', authMiddleware.verifyVendor, transactionController.vendorDestroy);
transactionRoutes.delete('/vendor/return/:returnId', authMiddleware.verifyVendor, transactionController.destroyVendorReturn);
transactionRoutes.delete('/vendor/withdrawal/:withdrawalId', authMiddleware.verifyVendor, transactionController.destroyVendorWithdrawal);
transactionRoutes.put('/vendor/address/:transId', authMiddleware.verifyVendor, transactionController.vendorUpdateOrderAddress);
transactionRoutes.put('/vendor/note/:transId', authMiddleware.verifyVendor, transactionController.vendorUpdateNote);
transactionRoutes.put('/vendor/return/:returnId', authMiddleware.verifyVendor, transactionController.updateVendorReturn);

module.exports = transactionRoutes;