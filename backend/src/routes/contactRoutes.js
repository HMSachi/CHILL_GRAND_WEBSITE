const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contact - Submit a message
router.post('/', contactController.submitContact);

// GET /api/contact - Get all messages (Admin)
router.get('/', contactController.getAllContacts);

// PATCH /api/contact/:id/status - Update message status
router.patch('/:id/status', contactController.updateContactStatus);

module.exports = router;
