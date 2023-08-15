const userRoutes = require('express').Router();
const userController = require('../controllers/userController');

userRoutes.get('/', userController.listCustomer);
userRoutes.post('/forgot', userController.forgotPassword);


module.exports = userRoutes;