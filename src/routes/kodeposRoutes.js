const kodeposRoutes = require('express').Router();
const kodeposController = require('../controllers/kodeposController');

kodeposRoutes.get('/', kodeposController.listKodepos);
kodeposRoutes.get('/:id', kodeposController.kodeposById);

module.exports = kodeposRoutes