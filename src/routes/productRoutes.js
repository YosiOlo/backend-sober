const productRoutes = require("express").Router();
const productController = require("../controllers/productController");
// const uploadMiddleware = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
// const adminMiddleware = require("../middlewares/adminMiddleware");

productRoutes.get("/categories", productController.listProductCategories);
productRoutes.get("/", productController.listProducts);
productRoutes.get("/:id", productController.detailProduct);
productRoutes.delete("/:id", productController.deleteProduct);

//vendor
productRoutes.get("/vendor/list", authMiddleware.verifyVendor, productController.vendorProducts);


module.exports = productRoutes;