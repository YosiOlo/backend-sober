const currencyRoutes = require('express').Router();
const currencyController = require('../controllers/currencyController');

currencyRoutes.get('/', currencyController.index);
currencyRoutes.get('/:id', currencyController.ById);

module.exports = currencyRoutes;