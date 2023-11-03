const kurirRoutes = require("express").Router();
const kurirController = require("../controllers/kurirController");
const authMiddleware = require("../middlewares/authMiddleware");

kurirRoutes.get("/branchs", authMiddleware.verifyToken, kurirController.listBranchs);
kurirRoutes.get("/origins", authMiddleware.verifyToken, kurirController.listOrigins);
kurirRoutes.get("/destinations", authMiddleware.verifyToken, kurirController.listDestinations);
kurirRoutes.get("/city", authMiddleware.verifyToken, kurirController.cityRajaOngkir);
kurirRoutes.post("/ongkir", authMiddleware.verifyToken, kurirController.checkOngkir);

module.exports = kurirRoutes;