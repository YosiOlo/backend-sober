const userRoutes = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const wishlistController = require('../controllers/wishlistController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

//admin
userRoutes.get('/admin/list', authMiddleware.verifyAdmin, userController.listCustomer);
userRoutes.post('/admin/add-admin', authMiddleware.verifyAdmin, userController.addAdmin);
userRoutes.put('/admin/update/:id', authMiddleware.verifyAdmin, userController.updateProfileAdmin);

userRoutes.put('/profile/update', authMiddleware.verifyToken, userController.updateProfile);

//vendor
userRoutes.get('/vendor', authMiddleware.verifyVendor, userController.vendorInfo);
userRoutes.put('/vendor/tax', authMiddleware.verifyVendor, userController.vendorTax);
userRoutes.put('/vendor/payment', authMiddleware.verifyVendor, userController.vendorPayment);
userRoutes.put('/vendor/profile', authMiddleware.verifyVendor, uploadMiddleware.multipleFieldUpload, userController.vendorProfile);
userRoutes.put('/vendor/tambahan', authMiddleware.verifyVendor, uploadMiddleware.backgroundUpload, userController.vendorTambahan);

//customer
userRoutes.post('/change-pw', authMiddleware.verifyToken, userController.forgotPassword);

//wishlist
userRoutes.get('/wishlist', authMiddleware.verifyToken, wishlistController.userWishlist);
userRoutes.post('/wishlist/:id', authMiddleware.verifyToken, wishlistController.addWishlist);
userRoutes.delete('/wishlist/:id', authMiddleware.verifyToken, wishlistController.userDelete);

userRoutes.get('/wishlist/admin/list', authMiddleware.verifyAdmin, wishlistController.allWishlist);
userRoutes.delete('/wishlist/admin/:id', authMiddleware.verifyAdmin, wishlistController.deleteWishlist);

module.exports = userRoutes;