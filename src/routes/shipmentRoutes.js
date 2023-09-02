const shipmentRoutes = require('express').Router()
const shipmentController = require('../controllers/shipmentController')
const authMiddleware = require('../middlewares/authMiddleware')

shipmentRoutes.get('/admin', authMiddleware.verifyAdmin, shipmentController.listShipment)
shipmentRoutes.delete('/admin/:id', authMiddleware.verifyAdmin, shipmentController.deleteShipment)

shipmentRoutes.get('/', authMiddleware.verifyToken, shipmentController.userShipment)
shipmentRoutes.get('/:id', authMiddleware.verifyToken, shipmentController.detailShipment)

shipmentRoutes.get('/vendor', authMiddleware.verifyVendor, shipmentController.vendorShipment)
shipmentRoutes.get('/vendor/:id', authMiddleware.verifyVendor, shipmentController.detailShipment)
shipmentRoutes.put('/vendor/:id', authMiddleware.verifyVendor, shipmentController.updateShipment)

module.exports = shipmentRoutes