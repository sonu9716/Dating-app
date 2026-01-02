const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

router.use(auth);

router.get('/:matchId', messageController.getMessages);
router.post('/:matchId', messageController.sendMessage);
router.put('/:matchId/read', messageController.markAsRead);

module.exports = router;
