const miscRoutes = require('express').Router();
const logsController = require('../controllers/logsController');

miscRoutes.get('/logs', logsController.index);
miscRoutes.delete('/logs/:id', logsController.destroy);
miscRoutes.delete('/logs/bulk', logsController.bulkDestroy);

module.exports = miscRoutes;