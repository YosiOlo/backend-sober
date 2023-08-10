const mainRoutes = require("express").Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/users", userRoutes);

module.exports = mainRoutes;