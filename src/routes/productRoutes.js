const productRoutes = require("express").Router();
const productController = require("../controllers/productController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
// const adminMiddleware = require("../middlewares/adminMiddleware");

productRoutes.get("/categories", productController.listProductCategories);
productRoutes.get("/", productController.listProducts);
productRoutes.get("/:id", productController.detailProduct);

//admin
productRoutes.delete("/:id",authMiddleware.verifyAdmin , productController.deleteProduct);

//vendor
productRoutes.get("/vendor/list", authMiddleware.verifyVendor, productController.vendorProducts);
productRoutes.post("/vendor/add", authMiddleware.verifyVendor, uploadMiddleware.multipleUpload, productController.addProduct);
productRoutes.delete("/vendor/:id", authMiddleware.verifyVendor, productController.deleteProduct);
productRoutes.put("/vendor/:id", authMiddleware.verifyVendor, productController.updateProduct);


module.exports = productRoutes;