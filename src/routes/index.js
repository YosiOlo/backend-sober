const mainRoutes = require("express").Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const currencyRoutes = require("./currencyRoutes");
const discountRoutes = require("./discountRoutes");
const kodeposRoutes = require("./kodeposRoutes");
const productRoutes = require("./productRoutes");

mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/users", userRoutes);

mainRoutes.use("/currency", currencyRoutes);
mainRoutes.use("/discount", discountRoutes);
mainRoutes.use("/kodepos", kodeposRoutes);
mainRoutes.use("/product", productRoutes);

module.exports = mainRoutes;