const mainRoutes = require("express").Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const currencyRoutes = require("./currencyRoutes");
const discountRoutes = require("./discountRoutes");
const kodeposRoutes = require("./kodeposRoutes");
const productRoutes = require("./productRoutes");
const kurirRoutes = require("./kurirRoutes");
const transactionRoutes = require("./transactionRoutes");
const miscRoutes = require("./miscRoutes");

//account routes
mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/users", userRoutes);

//master routes
mainRoutes.use("/currency", currencyRoutes);
mainRoutes.use("/discount", discountRoutes);
mainRoutes.use("/kodepos", kodeposRoutes);
mainRoutes.use("/product", productRoutes);
mainRoutes.use("/kurir", kurirRoutes);
mainRoutes.use("/transaction", transactionRoutes);

//logs routes
mainRoutes.use("/miscellaneous", miscRoutes);

module.exports = mainRoutes;