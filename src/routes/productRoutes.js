const productRoutes = require("express").Router();
const productController = require("../controllers/productController");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const optionController = require("../controllers/optionsController");

productRoutes.get("/categories", productController.listProductCategories);
productRoutes.get("/", productController.listProducts);
productRoutes.get("/:id", productController.detailProduct);
productRoutes.get("/stores/:id", productController.listProductsByVendor);

//admin
productRoutes.get("/admin/listbrand", authMiddleware.verifyAdmin, optionController.listBrands);
productRoutes.get("/admin/listtags", authMiddleware.verifyAdmin, optionController.listTags);
productRoutes.post("/admin/addbrand", authMiddleware.verifyAdmin, optionController.addBrands);
productRoutes.post("/admin/addtag", authMiddleware.verifyAdmin, optionController.addTags);
productRoutes.put("/admin/updatetags/:id", authMiddleware.verifyAdmin, optionController.updateTags);
productRoutes.delete("/admin/deletetags/:id", authMiddleware.verifyAdmin, optionController.deleteTags);
productRoutes.delete("/admin/deletebrand/:id", authMiddleware.verifyAdmin, optionController.deleteBrands);
productRoutes.delete("/:id",authMiddleware.verifyAdmin , productController.deleteProduct);

//vendor
productRoutes.get("/vendor/list", authMiddleware.verifyVendor, productController.vendorProducts);
productRoutes.get("/vendor/options", authMiddleware.verifyVendor, optionController.getOptions);
productRoutes.get("/vendor/global_options", authMiddleware.verifyVendor, optionController.getGlobalOptions);
productRoutes.post("/vendor/add", authMiddleware.verifyVendor, uploadMiddleware.multipleUpload, productController.addProduct);
productRoutes.delete("/vendor/:id", authMiddleware.verifyVendor, productController.vendorDelete);
productRoutes.delete("/vendor/etalase", authMiddleware.verifyVendor, productController.vendorDeleteEtalase);
productRoutes.put("/vendor/:id", authMiddleware.verifyVendor, uploadMiddleware.multipleUpload, productController.updateProduct);
productRoutes.put("/vendor/etalase", authMiddleware.verifyVendor, productController.vendorUpdateEtalase);


module.exports = productRoutes;