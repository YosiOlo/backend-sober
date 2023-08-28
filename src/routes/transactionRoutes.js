const transactionRoutes =  require("express").Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middlewares/authMiddleware");

//admin
transactionRoutes.get('/admin', authMiddleware.verifyAdmin, transactionController.getAll);
transactionRoutes.get('/admin/:id', authMiddleware.verifyAdmin,transactionController.index);
transactionRoutes.delete('/admin', authMiddleware.verifyAdmin,transactionController.destroy)

//user
transactionRoutes.get('/user', authMiddleware.verifyToken, transactionController.getUser);
transactionRoutes.post('/user', authMiddleware.verifyToken)

//vendor
transactionRoutes.get('/vendor', authMiddleware.verifyVendor, transactionController.getVendor);
transactionRoutes.get('/vendor/returns', authMiddleware.verifyVendor, transactionController.orderReturn);

module.exports = transactionRoutes;