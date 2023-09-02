const mainRoutes = require("express").Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const currencyRoutes = require("./currencyRoutes");
const discountRoutes = require("./discountRoutes");
const kodeposRoutes = require("./kodeposRoutes");
const productRoutes = require("./productRoutes");
const kurirRoutes = require("./kurirRoutes");
const transactionRoutes = require("./transactionRoutes");
const reviewRoutes = require("./reviewRoutes");
const shipmentRoutes = require("./shipmentRoutes");

const miscRoutes = require("./miscRoutes");
const contactRoutes = require("./contactRoutes");

//account routes
mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/users", userRoutes);

//common routes
mainRoutes.use("/currency", currencyRoutes);
mainRoutes.use("/discount", discountRoutes);
mainRoutes.use("/product", productRoutes);
mainRoutes.use("/review", reviewRoutes);

//trans routes
mainRoutes.use("/transaction", transactionRoutes);
mainRoutes.use("/kodepos", kodeposRoutes);
mainRoutes.use("/kurir", kurirRoutes);
mainRoutes.use("/shipment", shipmentRoutes);

//logs routes
mainRoutes.use("/miscellaneous", miscRoutes);
mainRoutes.use("/contact", contactRoutes);

//docs
mainRoutes.use('/docs', swaggerUi.serve);
mainRoutes.get('/docs', swaggerUi.setup(swaggerDocument));

module.exports = mainRoutes;