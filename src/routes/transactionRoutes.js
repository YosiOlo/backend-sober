const transactionRoutes =  require("express").Router();
const transactionController = require("../controllers/transactionController");
const withdrawalController = require("../controllers/withdrawalController");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

//admin
transactionRoutes.get('/admin', authMiddleware.verifyAdmin, transactionController.getAll);
transactionRoutes.get('/admin/:id', authMiddleware.verifyAdmin,transactionController.index);
transactionRoutes.get('/admin/withdrawal', authMiddleware.verifyAdmin, withdrawalController.getAll);    
transactionRoutes.get('/admin/user-withdrawal/:customerId', authMiddleware.verifyAdmin, withdrawalController.getAllByCustomerId);
transactionRoutes.delete('/admin/:transId', authMiddleware.verifyAdmin,transactionController.destroy);
transactionRoutes.put('/admin/accept-withdrawal/:withdrawalId', authMiddleware.verifyAdmin, withdrawalController.acceptWidhrawal);
transactionRoutes.put('/admin/decline-withdrawal/:withdrawalId', authMiddleware.verifyAdmin, withdrawalController.declineWithdrawal);

//user
transactionRoutes.get('/users', authMiddleware.verifyToken, transactionController.getUser);
transactionRoutes.get('/users/waiting', authMiddleware.verifyToken, transactionController.getUserWaiting);
transactionRoutes.post('/users', authMiddleware.verifyToken);
transactionRoutes.get('/cart', authMiddleware.verifyToken, cartController.cartUser);
transactionRoutes.post('/cart/:id', authMiddleware.verifyToken, cartController.addCart);
transactionRoutes.delete('/cart/:id', authMiddleware.verifyToken, cartController.deleteCart);
transactionRoutes.put('/cart/:id', authMiddleware.verifyToken, cartController.updateCart);

//vendor
transactionRoutes.get('/vendor', authMiddleware.verifyVendor, transactionController.getVendor);
transactionRoutes.get('/vendor/details/:id', authMiddleware.verifyVendor, transactionController.getVendorById);
transactionRoutes.get('/vendor/returns', authMiddleware.verifyVendor, transactionController.orderReturn);
transactionRoutes.get('/vendor/returns/details/:id', authMiddleware.verifyVendor, transactionController.orderReturnById);
transactionRoutes.get('/vendor/revenue', authMiddleware.verifyVendor, transactionController.vendorRevenue);
transactionRoutes.get('/vendor/history', authMiddleware.verifyVendor, transactionController.vendorRevenueHistory);
transactionRoutes.get('/vendor/withdrawal', authMiddleware.verifyVendor, transactionController.vendorWithdrawal);
transactionRoutes.post('/vendor/withdrawal', authMiddleware.verifyVendor, transactionController.vendorAddWithdrawal)
transactionRoutes.delete('/vendor/:transId', authMiddleware.verifyVendor, transactionController.vendorDestroy);
transactionRoutes.delete('/vendor/return/:returnId', authMiddleware.verifyVendor, transactionController.destroyVendorReturn);
transactionRoutes.delete('/vendor/withdrawal/:withdrawalId', authMiddleware.verifyVendor, transactionController.destroyVendorWithdrawal);
transactionRoutes.put('/vendor/address/:transId', authMiddleware.verifyVendor, transactionController.vendorUpdateOrderAddress);
transactionRoutes.put('/vendor/note/:transId', authMiddleware.verifyVendor, transactionController.vendorUpdateNote);
transactionRoutes.put('/vendor/return/:returnId', authMiddleware.verifyVendor, transactionController.updateVendorReturn);

module.exports = transactionRoutes;