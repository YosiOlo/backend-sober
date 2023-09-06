const authRoutes = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

authRoutes.get("/verify/:token", authController.verify);
authRoutes.get("/check", authMiddleware.verifyToken, authController.checkToken);
authRoutes.get("/logout", authMiddleware.verifyToken, authController.logout);
authRoutes.post("/signin", authController.signin);
authRoutes.post("/signup", authController.signup);
authRoutes.put("/reset", authController.resetPassword);
authRoutes.get("/resetpage/:token", authController.resetPage);
authRoutes.post("/sendReset", authController.sendEmailResetPassword);

module.exports = authRoutes;