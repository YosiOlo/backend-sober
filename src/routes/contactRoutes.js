const contactRoutes = require('express').Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');

contactRoutes.get('/', authMiddleware.verifyAdmin, contactController.listContacts);
contactRoutes.post('/', contactController.createContact);
contactRoutes.post('/reply/:id', authMiddleware.verifyAdmin, contactController.replyContact);
contactRoutes.delete('/:id', authMiddleware.verifyAdmin, contactController.deleteContact);
contactRoutes.delete('/reply/:id', authMiddleware.verifyAdmin, contactController.deleteReply);
contactRoutes.put('/:id', authMiddleware.verifyAdmin, contactController.statusReadContact);

module.exports = contactRoutes;