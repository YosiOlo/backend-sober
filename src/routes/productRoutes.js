const productRoutes = require("express").Router();
const productController = require("../controllers/productController");
// const uploadMiddleware = require("../middleware/uploadMiddleware");
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

productRoutes.get("/categories", productController.listProductCategories);
productRoutes.get("/", productController.listProducts);
productRoutes.get("/:id", productController.detailProduct);
productRoutes.delete("/:id", productController.deleteProduct);



module.exports = productRoutes;