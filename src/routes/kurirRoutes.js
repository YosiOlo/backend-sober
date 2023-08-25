const kurirRoutes = require("express").Router();
const kurirController = require("../controllers/kurirController");

kurirRoutes.get("/branchs", kurirController.listBranchs);
kurirRoutes.get("/origins", kurirController.listOrigins);
kurirRoutes.get("/destinations", kurirController.listDestinations);

module.exports = kurirRoutes;