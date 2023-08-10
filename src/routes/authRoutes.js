const authRoutes = require("express").Router();
const authController = require("../controllers/authController");

authRoutes.get("/verify/:token", authController.verify);
authRoutes.get("/check", authController.checkToken);
authRoutes.post("/signin", authController.signin);
authRoutes.post("/signup", authController.signup);

module.exports = authRoutes;