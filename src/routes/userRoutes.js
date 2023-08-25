const userRoutes = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//admin
userRoutes.get('/admin/list', authMiddleware.verifyAdmin, userController.listCustomer);
userRoutes.post('/admin/add-admin', authMiddleware.verifyAdmin, userController.addAdmin);
userRoutes.put('/admin/update/:id', authMiddleware.verifyAdmin, );

//user
userRoutes.post('/change-pw', authMiddleware.verifyToken, userController.forgotPassword);


module.exports = userRoutes;